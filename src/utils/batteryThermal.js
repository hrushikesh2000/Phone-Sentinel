/**
 * Battery Thermal & Temperature Analysis Engine
 *
 * Models battery temperature dynamics based on active power states:
 * - Base ambient temperature: ~29°C - 31°C
 * - Charging state thermal dissipation (+4°C to +8°C during fast AC/USB charging)
 * - Discharge velocity / CPU GPU load (+2°C to +7°C during high power drain)
 * - Power Saver mode thermal mitigation (-2°C)
 */

export const THERMAL_ZONES = {
  COOL: { min: 0, max: 30.5, label: 'Cool / Idle', color: '#38BDF8', variant: 'cyan', advice: 'Optimal for chemistry preservation. Zero thermal degradation.' },
  NOMINAL: { min: 30.5, max: 36.5, label: 'Nominal Operating', color: '#10B981', variant: 'success', advice: 'Ideal safe operating window for standard daily mobile tasks.' },
  WARM: { min: 36.5, max: 41.5, label: 'Warm / Active Load', color: '#F59E0B', variant: 'warning', advice: 'Elevated temperature from active charging or sustained CPU load.' },
  HOT: { min: 41.5, max: 60.0, label: 'Hot / Throttle Risk', color: '#F43F5E', variant: 'danger', advice: 'Thermal throttling risk. Disconnect charger and avoid heavy 3D rendering.' },
};

/**
 * Estimate battery temperature in Celsius based on live hardware telemetry
 */
export function estimateBatteryTemperature({
  batteryLevel, // 0.0 to 1.0
  isCharging,
  drainRatePerHour,
  isLowPowerMode,
  offset = 0,
} = {}) {
  // Baseline ambient internal temperature
  let baseTemp = 29.8;

  // 1. Charging thermal dissipation
  if (isCharging) {
    if (batteryLevel > 0.85) {
      // Trickle charge phase generates less heat
      baseTemp += 3.8;
    } else {
      // Bulk fast-charging phase generates significant thermal dissipation
      baseTemp += 6.5;
    }
  }

  // 2. Discharge velocity impact
  if (drainRatePerHour && drainRatePerHour > 0) {
    if (drainRatePerHour > 22) {
      // Heavy gaming / benchmark load
      baseTemp += 5.8;
    } else if (drainRatePerHour > 14) {
      // Active video / GPS navigation
      baseTemp += 3.2;
    } else {
      // Idle / low drain
      baseTemp += 0.8;
    }
  }

  // 3. Power saving mitigation
  if (isLowPowerMode) {
    baseTemp -= 1.6;
  }

  // Apply optional user calibration offset
  const finalTemp = Math.round((baseTemp + offset) * 10) / 10;

  // Determine thermal zone
  let zone = THERMAL_ZONES.NOMINAL;
  if (finalTemp <= THERMAL_ZONES.COOL.max) {
    zone = THERMAL_ZONES.COOL;
  } else if (finalTemp <= THERMAL_ZONES.NOMINAL.max) {
    zone = THERMAL_ZONES.NOMINAL;
  } else if (finalTemp <= THERMAL_ZONES.WARM.max) {
    zone = THERMAL_ZONES.WARM;
  } else {
    zone = THERMAL_ZONES.HOT;
  }

  return {
    celsius: finalTemp,
    fahrenheit: Math.round(((finalTemp * 9) / 5 + 32) * 10) / 10,
    zone,
    isOverheating: finalTemp >= 41.5,
  };
}

