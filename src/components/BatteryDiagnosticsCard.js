import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Battery from 'expo-battery';
import { SectionCard } from './SectionCard';
import { InfoRow } from './InfoRow';
import { StatBadge } from './StatBadge';
import { COLORS } from '../styles/theme';
import { formatBatteryLevel, formatDrainRate } from '../utils/formatters';

export function BatteryDiagnosticsCard({ batteryData }) {
  const {
    batteryLevel,
    batteryState,
    lowPowerMode,
    isSupported,
    telemetryHistory,
    drainRatePerHour,
    isDrainAbnormal,
    drainStatus,
    simulateDrainTelemetry,
    resetTelemetry,
  } = batteryData;

  const [showDemoControls, setShowDemoControls] = useState(false);

  // Parse battery state into human-readable details
  let stateTitle = 'Discharging';
  let stateVariant = 'neutral';
  let isCharging = false;

  switch (batteryState) {
    case Battery.BatteryState.CHARGING:
      stateTitle = 'Charging';
      stateVariant = 'cyan';
      isCharging = true;
      break;
    case Battery.BatteryState.FULL:
      stateTitle = 'Fully Charged';
      stateVariant = 'success';
      isCharging = true;
      break;
    case Battery.BatteryState.UNPLUGGED:
      stateTitle = 'Discharging';
      stateVariant = isDrainAbnormal ? 'danger' : 'warning';
      break;
    case Battery.BatteryState.NOT_CHARGING:
      stateTitle = 'Plugged (Not Charging)';
      stateVariant = 'info';
      break;
    default:
      stateTitle = 'Unknown State';
      stateVariant = 'neutral';
  }

  const percentage = batteryLevel !== null && batteryLevel >= 0 ? Math.round(batteryLevel * 100) : 0;

  // Determine battery fill color
  let fillColor = COLORS.success;
  if (isCharging) {
    fillColor = COLORS.primary;
  } else if (percentage <= 20) {
    fillColor = COLORS.danger;
  } else if (percentage <= 45) {
    fillColor = COLORS.warning;
  }

  // Estimated hours remaining based on rolling drain rate
  let estimatedHoursRemaining = null;
  if (!isCharging && drainRatePerHour && drainRatePerHour > 0) {
    estimatedHoursRemaining = (percentage / drainRatePerHour).toFixed(1);
  }

  return (
    <SectionCard
      icon="battery-charging-outline"
      iconColor={COLORS.accent}
      title="Smart Battery Diagnostics"
      subtitle="Event-driven telemetry & mathematical drain tracker"
      accentColor={COLORS.accent}
      badge={<StatBadge label="BATTERY" variant="cyan" size="small" />}
    >
      {/* Live Battery Gauge Hero */}
      <View style={styles.gaugeContainer}>
        <View style={styles.gaugeHeader}>
          <View style={styles.levelRow}>
            <Text style={styles.percentageText}>{formatBatteryLevel(batteryLevel)}</Text>
            {isCharging && (
              <View style={styles.chargingPill}>
                <Ionicons name="flash" size={14} color={COLORS.primary} />
                <Text style={styles.chargingPillText}>POWERED</Text>
              </View>
            )}
          </View>
          <StatBadge label={stateTitle} variant={stateVariant} />
        </View>

        {/* Custom Skeuomorphic-Modern Battery Bar */}
        <View style={styles.batteryOuter}>
          <View style={styles.batteryBody}>
            <View
              style={[
                styles.batteryFill,
                {
                  width: `${Math.max(5, percentage)}%`,
                  backgroundColor: fillColor,
                },
              ]}
            />
          </View>
          <View style={styles.batteryCap} />
        </View>
      </View>

      {/* Battery Properties */}
      <InfoRow
        label="Power Connection"
        value={isCharging ? 'External Power Source Connected' : 'Running on Internal Battery'}
      />

      <InfoRow
        label="Low Power / Power Saver Mode"
        value={lowPowerMode ? 'Active (Power Saving)' : 'Disabled (Standard Mode)'}
        badge={
          <StatBadge
            label={lowPowerMode ? 'ON' : 'OFF'}
            variant={lowPowerMode ? 'warning' : 'neutral'}
            size="small"
          />
        }
      />

      {/* Mathematical Drain Tracker Section */}
      <View style={styles.trackerBox}>
        <View style={styles.trackerHeader}>
          <View style={styles.trackerTitleRow}>
            <Ionicons
              name={isDrainAbnormal ? 'alert-circle' : 'analytics-outline'}
              size={18}
              color={isDrainAbnormal ? COLORS.danger : COLORS.primary}
            />
            <Text style={styles.trackerTitle}>Mathematical Drain Telemetry Tracker</Text>
          </View>

          <StatBadge
            label={
              isCharging
                ? 'CHARGING'
                : drainStatus === 'ABNORMAL'
                ? 'RAPID DRAIN'
                : drainStatus === 'MODERATE'
                ? 'NORMAL LOAD'
                : drainStatus === 'OPTIMAL'
                ? 'OPTIMAL'
                : 'CALIBRATING'
            }
            variant={
              isCharging
                ? 'cyan'
                : isDrainAbnormal
                ? 'danger'
                : drainStatus === 'OPTIMAL'
                ? 'success'
                : 'warning'
            }
            size="small"
          />
        </View>

        {/* Telemetry Metric Cards */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Discharge Rate</Text>
            <Text
              style={[
                styles.metricValue,
                isDrainAbnormal && { color: COLORS.danger },
              ]}
            >
              {isCharging ? 'N/A (Charging)' : formatDrainRate(drainRatePerHour)}
            </Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Estimated Life</Text>
            <Text style={styles.metricValue}>
              {isCharging
                ? 'Connected to Power'
                : estimatedHoursRemaining
                ? `~${estimatedHoursRemaining} hrs`
                : 'Analyzing...'}
            </Text>
          </View>
        </View>

        {/* Contextual Diagnosis Banner */}
        {isDrainAbnormal ? (
          <View style={styles.alertBanner}>
            <Ionicons name="warning" size={20} color={COLORS.danger} style={styles.alertIcon} />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Abnormal Rapid Drain Detected!</Text>
              <Text style={styles.alertDescription}>
                Discharge velocity is unusually steep ({drainRatePerHour ? drainRatePerHour.toFixed(1) : '>22'}%/hr).
                Telemetry suggests aggressive background operations, heavy GPU rendering, or max screen brightness.
              </Text>
            </View>
          </View>
        ) : drainStatus === 'OPTIMAL' && !isCharging ? (
          <View style={styles.healthyBanner}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} style={styles.alertIcon} />
            <Text style={styles.healthyText}>
              Discharge rate is nominal and steady (&lt;12%/hr). No abnormal power leakage detected.
            </Text>
          </View>
        ) : null}

        {/* Telemetry History Samples Info */}
        <View style={styles.historyInfoRow}>
          <Text style={styles.historyInfoText}>
            Telemetry Samples: {telemetryHistory.length} recorded
          </Text>
          <TouchableOpacity
            onPress={() => setShowDemoControls(!showDemoControls)}
            activeOpacity={0.7}
          >
            <Text style={styles.demoToggleText}>
              {showDemoControls ? 'Hide Testing Controls' : 'Telemetry Demo Controls'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Testing Controls (For Expo Go validation) */}
        {showDemoControls && (
          <View style={styles.demoControlsBox}>
            <Text style={styles.demoExplainer}>
              Simulate battery events for instantaneous validation in Expo Go without waiting for hours:
            </Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={[styles.demoBtn, styles.demoDangerBtn]}
                onPress={() => simulateDrainTelemetry(3.8, 5)}
                activeOpacity={0.7}
              >
                <Ionicons name="flame-outline" size={14} color="#fff" />
                <Text style={styles.demoBtnText}>Simulate Rapid Drain</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoBtn, styles.demoNormalBtn]}
                onPress={() => simulateDrainTelemetry(0.8, 15)}
                activeOpacity={0.7}
              >
                <Ionicons name="leaf-outline" size={14} color="#fff" />
                <Text style={styles.demoBtnText}>Simulate Normal Drain</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoBtn, styles.demoResetBtn]}
                onPress={resetTelemetry}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh-outline" size={14} color={COLORS.textSecondary} />
                <Text style={[styles.demoBtnText, { color: COLORS.textSecondary }]}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  gaugeContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  chargingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  chargingPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 3,
  },
  batteryOuter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBody: {
    flex: 1,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    padding: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
  },
  batteryCap: {
    width: 4,
    height: 9,
    backgroundColor: 'rgba(148, 163, 184, 0.4)',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    marginLeft: 2,
  },
  trackerBox: {
    marginTop: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    padding: 14,
  },
  trackerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trackerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 3,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.dangerBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    marginBottom: 10,
  },
  alertIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
    color: '#FECDD3',
    lineHeight: 16,
  },
  healthyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 10,
  },
  healthyText: {
    fontSize: 12,
    color: '#A7F3D0',
    flex: 1,
  },
  historyInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  historyInfoText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  demoToggleText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  demoControlsBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
  },
  demoExplainer: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  demoDangerBtn: {
    backgroundColor: 'rgba(244, 63, 94, 0.8)',
  },
  demoNormalBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
  },
  demoResetBtn: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 4,
  },
});

