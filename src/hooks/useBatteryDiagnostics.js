import { useState, useEffect, useCallback, useRef } from 'react';
import * as Battery from 'expo-battery';

// Maximum rolling telemetry samples to store in memory
const MAX_TELEMETRY_POINTS = 30;

// Drain rate thresholds in % per hour
export const DRAIN_THRESHOLDS = {
  OPTIMAL_MAX: 12.0,   // <= 12%/hr: Optimal low consumption
  MODERATE_MAX: 22.0,  // 12-22%/hr: Standard active consumption
  RAPID_MIN: 22.0,     // > 22%/hr: Flagged as abnormal rapid drain
};

/**
 * Custom hook for live battery telemetry and mathematical drain estimation
 */
export function useBatteryDiagnostics() {
  const [batteryLevel, setBatteryLevel] = useState(null); // 0.0 to 1.0
  const [batteryState, setBatteryState] = useState(Battery.BatteryState.UNKNOWN);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [drainRatePerHour, setDrainRatePerHour] = useState(null);
  const [isDrainAbnormal, setIsDrainAbnormal] = useState(false);
  const [drainStatus, setDrainStatus] = useState('CALIBRATING'); // 'OPTIMAL' | 'MODERATE' | 'ABNORMAL' | 'CHARGING' | 'CALIBRATING'

  // Ref to hold the current history without causing listener re-binding loops
  const historyRef = useRef([]);
  const batteryLevelRef = useRef(batteryLevel);
  batteryLevelRef.current = batteryLevel;
  const batteryStateRef = useRef(batteryState);
  batteryStateRef.current = batteryState;

  /**
   * Evaluates rolling telemetry data points to calculate discharge rate per hour
   */
  const evaluateDrainTelemetry = useCallback((samples, currentState) => {
    if (
      currentState === Battery.BatteryState.CHARGING ||
      currentState === Battery.BatteryState.FULL
    ) {
      setDrainRatePerHour(null);
      setIsDrainAbnormal(false);
      setDrainStatus('CHARGING');
      return;
    }

    // Filter samples where device was unplugged
    const unpluggedSamples = samples.filter(
      (s) => s.state === Battery.BatteryState.UNPLUGGED || s.state === Battery.BatteryState.UNKNOWN
    );

    if (unpluggedSamples.length < 2) {
      setDrainStatus('CALIBRATING');
      return;
    }

    const firstPoint = unpluggedSamples[0];
    const latestPoint = unpluggedSamples[unpluggedSamples.length - 1];

    const elapsedHours = (latestPoint.timestamp - firstPoint.timestamp) / (1000 * 60 * 60);
    const dropPercentage = (firstPoint.level - latestPoint.level) * 100;

    // Minimum window: at least 15 seconds (0.0041 hours) to avoid zero-division spikes
    if (elapsedHours > 0.0041) {
      if (dropPercentage > 0) {
        const ratePerHour = dropPercentage / elapsedHours;
        setDrainRatePerHour(ratePerHour);

        if (ratePerHour > DRAIN_THRESHOLDS.RAPID_MIN) {
          setIsDrainAbnormal(true);
          setDrainStatus('ABNORMAL');
        } else if (ratePerHour > DRAIN_THRESHOLDS.OPTIMAL_MAX) {
          setIsDrainAbnormal(false);
          setDrainStatus('MODERATE');
        } else {
          setIsDrainAbnormal(false);
          setDrainStatus('OPTIMAL');
        }
      } else {
        // Battery level hasn't dropped yet in this measurement interval
        setDrainRatePerHour(0);
        setIsDrainAbnormal(false);
        setDrainStatus('OPTIMAL');
      }
    } else {
      setDrainStatus('CALIBRATING');
    }
  }, []);

  /**
   * Appends a new timestamped telemetry snapshot to the rolling buffer
   */
  const recordTelemetryPoint = useCallback((level, state) => {
    if (level === null || level < 0) return;

    const now = Date.now();
    const newPoint = { timestamp: now, level, state };

    // Keep rolling window bounded
    const updated = [...historyRef.current, newPoint].slice(-MAX_TELEMETRY_POINTS);
    historyRef.current = updated;
    setTelemetryHistory(updated);

    evaluateDrainTelemetry(updated, state);
  }, [evaluateDrainTelemetry]);

  /**
   * Query full native battery status from Expo API
   */
  const fetchBatteryState = useCallback(async () => {
    try {
      const available = await Battery.isAvailableAsync();
      setIsSupported(available);
      if (!available) return;

      const powerState = await Battery.getPowerStateAsync();
      setBatteryLevel(powerState.batteryLevel);
      setBatteryState(powerState.batteryState);
      setLowPowerMode(!!powerState.lowPowerMode);

      recordTelemetryPoint(powerState.batteryLevel, powerState.batteryState);
    } catch (err) {
      console.warn('Error reading battery status:', err);
    }
  }, [recordTelemetryPoint]);

  useEffect(() => {
    let isCancelled = false;
    let levelSub = null;
    let stateSub = null;
    let powerModeSub = null;
    let pollInterval = null;

    async function initBatteryListeners() {
      try {
        const available = await Battery.isAvailableAsync();
        if (isCancelled) return;
        setIsSupported(available);
        if (!available) return;

        // 1. Initial status fetch
        const initialPower = await Battery.getPowerStateAsync();
        if (isCancelled) return;
        setBatteryLevel(initialPower.batteryLevel);
        setBatteryState(initialPower.batteryState);
        setLowPowerMode(!!initialPower.lowPowerMode);
        recordTelemetryPoint(initialPower.batteryLevel, initialPower.batteryState);

        // 2. Event listener: Battery Level
        levelSub = Battery.addBatteryLevelListener(({ batteryLevel: newLevel }) => {
          if (!isCancelled) {
            setBatteryLevel(newLevel);
            recordTelemetryPoint(newLevel, batteryStateRef.current);
          }
        });

        // 3. Event listener: Battery Charging State
        stateSub = Battery.addBatteryStateListener(({ batteryState: newState }) => {
          if (!isCancelled) {
            setBatteryState(newState);
            recordTelemetryPoint(batteryLevelRef.current, newState);
          }
        });

        // 4. Event listener: Low Power Mode
        if (typeof Battery.addLowPowerModeListener === 'function') {
          powerModeSub = Battery.addLowPowerModeListener(({ lowPowerMode: isLow }) => {
            if (!isCancelled) {
              setLowPowerMode(isLow);
            }
          });
        }

        // 5. Active background sampling ticker (every 30 seconds)
        // Ensures rolling mathematical tracker accumulates samples reliably on Android
        pollInterval = setInterval(async () => {
          if (isCancelled) return;
          try {
            const current = await Battery.getPowerStateAsync();
            if (!isCancelled) {
              setBatteryLevel(current.batteryLevel);
              setBatteryState(current.batteryState);
              recordTelemetryPoint(current.batteryLevel, current.batteryState);
            }
          } catch (e) {
            // Ignore background tick read errors
          }
        }, 30000);
      } catch (e) {
        if (!isCancelled) {
          console.warn('Battery initialization error:', e);
        }
      }
    }

    initBatteryListeners();

    return () => {
      isCancelled = true;
      if (levelSub && typeof levelSub.remove === 'function') levelSub.remove();
      if (stateSub && typeof stateSub.remove === 'function') stateSub.remove();
      if (powerModeSub && typeof powerModeSub.remove === 'function') powerModeSub.remove();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [recordTelemetryPoint]);

  /**
   * Helper to simulate a battery drop for instant live testing & demonstration in Expo Go
   * e.g., drops 3% over a virtual 5 minutes to trigger abnormal drain detection
   */
  const simulateDrainTelemetry = useCallback((dropPercent = 3.5, simulatedMinutes = 5) => {
    const baseLevel = batteryLevel !== null && batteryLevel > 0.1 ? batteryLevel : 0.85;
    const now = Date.now();
    const pastTime = now - simulatedMinutes * 60 * 1000;

    const simulatedSamples = [
      { timestamp: pastTime, level: baseLevel, state: Battery.BatteryState.UNPLUGGED },
      { timestamp: now, level: Math.max(0.01, baseLevel - dropPercent / 100), state: Battery.BatteryState.UNPLUGGED },
    ];

    historyRef.current = simulatedSamples;
    setTelemetryHistory(simulatedSamples);
    setBatteryState(Battery.BatteryState.UNPLUGGED);
    setBatteryLevel(simulatedSamples[1].level);
    evaluateDrainTelemetry(simulatedSamples, Battery.BatteryState.UNPLUGGED);
  }, [batteryLevel, evaluateDrainTelemetry]);

  /**
   * Reset telemetry buffer back to clean baseline
   */
  const resetTelemetry = useCallback(() => {
    historyRef.current = [];
    setTelemetryHistory([]);
    setDrainRatePerHour(null);
    setIsDrainAbnormal(false);
    setDrainStatus('CALIBRATING');
    fetchBatteryState();
  }, [fetchBatteryState]);

  return {
    batteryLevel,
    batteryState,
    lowPowerMode,
    isSupported,
    telemetryHistory,
    drainRatePerHour,
    isDrainAbnormal,
    drainStatus,
    refreshBattery: fetchBatteryState,
    simulateDrainTelemetry,
    resetTelemetry,
  };
}

