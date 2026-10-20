import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Battery from 'expo-battery';
import * as Haptics from 'expo-haptics';
import { SectionCard } from './SectionCard';
import { InfoRow } from './InfoRow';
import { StatBadge } from './StatBadge';
import { ExplainerModal } from './ExplainerModal';
import { useTheme } from '../context/ThemeContext';
import { formatBatteryLevel, formatDrainRate } from '../utils/formatters';

export function BatteryDiagnosticsCard({ batteryData }) {
  const { theme, isDark } = useTheme();

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
  const [longevityGuard, setLongevityGuard] = useState(true);
  const [guardAlertDismissed, setGuardAlertDismissed] = useState(false);
  const [explainerTopic, setExplainerTopic] = useState(null);

  // Parse battery state into human-readable details
  let stateTitle = 'Discharging';
  let stateVariant = 'neutral';
  let isCharging = false;

  switch (batteryState) {
    case Battery.BatteryState.CHARGING:
      stateTitle = 'Charging';
      stateVariant = 'primary';
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
      stateTitle = 'Plugged In';
      stateVariant = 'info';
      break;
    default:
      stateTitle = 'Standard Power';
      stateVariant = 'neutral';
  }

  const percentage = batteryLevel !== null && batteryLevel >= 0 ? Math.round(batteryLevel * 100) : 0;

  // Determine battery fill color
  let fillColor = theme.success;
  if (isCharging) {
    fillColor = theme.primary;
  } else if (percentage <= 20) {
    fillColor = theme.danger;
  } else if (percentage <= 45) {
    fillColor = theme.warning;
  }

  // Estimated hours remaining based on rolling drain rate
  let estimatedHoursRemaining = null;
  if (!isCharging && drainRatePerHour && drainRatePerHour > 0) {
    estimatedHoursRemaining = (percentage / drainRatePerHour).toFixed(1);
  }

  // Trigger tactile alert when 80% is reached during charging with guard enabled
  useEffect(() => {
    if (longevityGuard && isCharging && percentage >= 80 && !guardAlertDismissed) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (e) {}
    }
  }, [longevityGuard, isCharging, percentage, guardAlertDismissed]);

  // Screen-On-Time (SOT) Predictive Activity Breakdown
  const sotPredictions = [
    {
      activity: '3D Gaming',
      icon: 'game-controller-outline',
      hours: Math.max(0.1, percentage * 0.05).toFixed(1) + 'h',
      rate: '~20%/hr',
      color: '#EF4444',
    },
    {
      activity: 'Video Stream',
      icon: 'play-circle-outline',
      hours: Math.max(0.2, percentage * 0.12).toFixed(1) + 'h',
      rate: '~8.3%/hr',
      color: '#F59E0B',
    },
    {
      activity: 'Web & Social',
      icon: 'globe-outline',
      hours: Math.max(0.2, percentage * 0.16).toFixed(1) + 'h',
      rate: '~6.2%/hr',
      color: '#00F2FE',
    },
    {
      activity: 'Music Audio',
      icon: 'musical-notes-outline',
      hours: Math.max(0.5, percentage * 0.45).toFixed(1) + 'h',
      rate: '~2.2%/hr',
      color: '#10B981',
    },
    {
      activity: 'Standby Sleep',
      icon: 'moon-outline',
      hours: Math.max(1, Math.round(percentage * 1.2)) + 'h',
      rate: '~0.8%/hr',
      color: '#8B5CF6',
    },
  ];

  return (
    <SectionCard
      icon="battery-charging-outline"
      iconColor={theme.accent}
      title="Battery Telemetry"
      subtitle="Live charge percentage & discharge velocity tracker"
      badge={<StatBadge label={stateTitle} variant={stateVariant} size="small" />}
      onHelpPress={() => setExplainerTopic('battery_drain_rate')}
    >
      {/* Live Battery Gauge Hero */}
      <View
        style={[
          styles.gaugeContainer,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.gaugeHeader}>
          <View style={styles.levelRow}>
            <Text style={[styles.percentageText, { color: theme.textPrimary }]}>
              {formatBatteryLevel(batteryLevel)}
            </Text>
            {isCharging && (
              <View
                style={[
                  styles.chargingPill,
                  {
                    backgroundColor: theme.primaryLight,
                    borderColor: `${theme.primary}44`,
                  },
                ]}
              >
                <Ionicons name="flash" size={13} color={theme.primary} />
                <Text style={[styles.chargingPillText, { color: theme.primary }]}>POWER CONNECTED</Text>
              </View>
            )}
          </View>
          <StatBadge label={stateTitle} variant={stateVariant} />
        </View>

        {/* Clean Modern Battery Capsule */}
        <View style={styles.batteryOuter}>
          <View
            style={[
              styles.batteryBody,
              {
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.2)',
                backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#E2E8F0',
              },
            ]}
          >
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
          <View
            style={[
              styles.batteryCap,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.2)',
              },
            ]}
          />
        </View>
      </View>

      {/* Battery Properties */}
      <InfoRow
        label="Power Source"
        value={isCharging ? 'AC / USB Power Adapter' : 'Internal Battery Power'}
      />

      <InfoRow
        label="Power Saver Mode"
        value={lowPowerMode ? 'Enabled' : 'Disabled'}
        badge={
          <StatBadge
            label={lowPowerMode ? 'Active' : 'Off'}
            variant={lowPowerMode ? 'warning' : 'neutral'}
            size="small"
          />
        }
      />

      {/* Mathematical Drain Tracker Section */}
      <View
        style={[
          styles.trackerBox,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.trackerHeader}>
          <View style={styles.trackerTitleRow}>
            <Ionicons
              name={isDrainAbnormal ? 'alert-circle' : 'analytics-outline'}
              size={18}
              color={isDrainAbnormal ? theme.danger : theme.primary}
            />
            <Text style={[styles.trackerTitle, { color: theme.textPrimary }]}>
              Rolling Discharge Tracker
            </Text>
          </View>

          <StatBadge
            label={
              isCharging
                ? 'Charging'
                : drainStatus === 'ABNORMAL'
                ? 'Rapid Drain'
                : drainStatus === 'MODERATE'
                ? 'Active Load'
                : drainStatus === 'OPTIMAL'
                ? 'Optimal'
                : 'Calibrating'
            }
            variant={
              isCharging
                ? 'primary'
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
        <View
          style={[
            styles.metricsRow,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Discharge Rate</Text>
            <Text
              style={[
                styles.metricValue,
                { color: isDrainAbnormal ? theme.danger : theme.textPrimary },
              ]}
            >
              {isCharging ? 'N/A (Charging)' : formatDrainRate(drainRatePerHour)}
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: theme.divider }]} />

          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Estimated Remaining</Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
              {isCharging
                ? 'Plugged In'
                : estimatedHoursRemaining
                ? `~${estimatedHoursRemaining} hrs`
                : 'Measuring...'}
            </Text>
          </View>
        </View>

        {/* 80% Battery Longevity Guard Active Alert Banner */}
        {longevityGuard && isCharging && percentage >= 80 && !guardAlertDismissed && (
          <View style={styles.longevityAlertBanner}>
            <Ionicons name="shield-checkmark" size={22} color="#10B981" style={styles.alertIcon} />
            <View style={styles.alertTextContainer}>
              <Text style={styles.longevityAlertTitle}>80% Longevity Ceiling Reached</Text>
              <Text style={styles.longevityAlertDesc}>
                Unplug your charger now. Capping daily charge at 80% protects lithium ion cathode integrity and extends cycle lifespan by up to 2×.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.dismissAlertBtn}
              onPress={() => setGuardAlertDismissed(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        )}

        {/* 80% Longevity Guard Switch Bar */}
        <View style={[styles.guardToggleRow, { borderTopColor: theme.cardBorder, borderBottomColor: theme.cardBorder }]}>
          <View style={styles.guardLabelWrap}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.guardTitle, { color: theme.textPrimary }]}>80% Battery Longevity Guard</Text>
                <TouchableOpacity
                  onPress={() => setExplainerTopic('battery_80_guard')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{ marginLeft: 6 }}
                >
                  <Ionicons name="help-circle-outline" size={16} color="#10B981" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.guardSubtitle, { color: theme.textSecondary }]}>
                Tactile warning when battery reaches 80% while charging
              </Text>
            </View>
          </View>
          <Switch
            value={longevityGuard}
            onValueChange={(val) => {
              setLongevityGuard(val);
              if (val) setGuardAlertDismissed(false);
              try {
                Haptics.selectionAsync();
              } catch (e) {}
            }}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Screen-On-Time (SOT) Predictive Activity Breakdown */}
        <View
          style={[
            styles.sotCard,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.sotHeader}>
            <View style={styles.sotTitleWrap}>
              <Ionicons name="speedometer-outline" size={16} color="#00F2FE" />
              <Text style={[styles.sotHeaderTitle, { color: theme.textPrimary }]}>
                Predictive Screen-On Time (SOT)
              </Text>
            </View>
            <Text style={[styles.sotRemainingTag, { color: '#00F2FE' }]}>
              {percentage}% Charge
            </Text>
          </View>

          <View style={styles.sotGrid}>
            {sotPredictions.map((item) => (
              <View
                key={item.activity}
                style={[
                  styles.sotItem,
                  {
                    borderColor: theme.cardBorder,
                    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : '#FFFFFF',
                  },
                ]}
              >
                <View style={styles.sotItemTop}>
                  <Ionicons name={item.icon} size={15} color={item.color} />
                  <Text style={[styles.sotItemHours, { color: theme.textPrimary }]}>
                    {item.hours}
                  </Text>
                </View>
                <Text style={[styles.sotItemLabel, { color: theme.textSecondary }]} numberOfLines={1}>
                  {item.activity}
                </Text>
                <Text style={[styles.sotItemRate, { color: theme.textMuted }]}>
                  {item.rate}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contextual Diagnosis Banner */}
        {isDrainAbnormal ? (
          <View
            style={[
              styles.alertBanner,
              {
                backgroundColor: theme.dangerBg,
                borderColor: `${theme.danger}44`,
              },
            ]}
          >
            <Ionicons name="warning-outline" size={20} color={theme.danger} style={styles.alertIcon} />
            <View style={styles.alertTextContainer}>
              <Text style={[styles.alertTitle, { color: theme.danger }]}>Rapid Battery Discharge</Text>
              <Text style={[styles.alertDescription, { color: theme.textSecondary }]}>
                Discharge velocity is elevated ({drainRatePerHour ? drainRatePerHour.toFixed(1) : '>22'}%/hr).
                Consider lowering screen brightness or closing background apps.
              </Text>
            </View>
          </View>
        ) : drainStatus === 'OPTIMAL' && !isCharging ? (
          <View
            style={[
              styles.healthyBanner,
              {
                backgroundColor: theme.successBg,
                borderColor: `${theme.success}44`,
              },
            ]}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={theme.success} style={styles.alertIcon} />
            <Text style={[styles.healthyText, { color: theme.textPrimary }]}>
              Discharge rate is nominal (&lt;12%/hr). Battery is running efficiently.
            </Text>
          </View>
        ) : null}

        {/* Telemetry History Samples Info */}
        <View style={styles.historyInfoRow}>
          <Text style={[styles.historyInfoText, { color: theme.textMuted }]}>
            Telemetry Samples: {telemetryHistory.length} recorded
          </Text>
          <TouchableOpacity
            onPress={() => setShowDemoControls(!showDemoControls)}
            activeOpacity={0.7}
          >
            <Text style={[styles.demoToggleText, { color: theme.primary }]}>
              {showDemoControls ? 'Hide Controls' : 'Simulate Telemetry'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Testing Controls (For validation) */}
        {showDemoControls && (
          <View style={[styles.demoControlsBox, { borderTopColor: theme.divider }]}>
            <Text style={[styles.demoExplainer, { color: theme.textSecondary }]}>
              Simulate battery events for instantaneous validation without waiting hours:
            </Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: theme.danger }]}
                onPress={() => simulateDrainTelemetry(3.8, 5)}
                activeOpacity={0.7}
              >
                <Ionicons name="flame-outline" size={14} color="#fff" />
                <Text style={styles.demoBtnText}>Simulate Rapid Drain</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: theme.success }]}
                onPress={() => simulateDrainTelemetry(0.8, 15)}
                activeOpacity={0.7}
              >
                <Ionicons name="leaf-outline" size={14} color="#fff" />
                <Text style={styles.demoBtnText}>Simulate Normal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: theme.cardElevated, borderWidth: 1, borderColor: theme.cardBorder }]}
                onPress={resetTelemetry}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh-outline" size={14} color={theme.textPrimary} />
                <Text style={[styles.demoBtnText, { color: theme.textPrimary }]}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Plain-English Explainer Modal */}
      <ExplainerModal
        visible={!!explainerTopic}
        topicKey={explainerTopic}
        onClose={() => setExplainerTopic(null)}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  gaugeContainer: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '800',
    marginRight: 10,
    letterSpacing: -0.5,
  },
  chargingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  chargingPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  batteryOuter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBody: {
    flex: 1,
    height: 18,
    borderRadius: 7,
    borderWidth: 1.5,
    padding: 2,
  },
  batteryFill: {
    height: '100%',
    borderRadius: 4,
  },
  batteryCap: {
    width: 4,
    height: 9,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    marginLeft: 2.5,
  },
  trackerBox: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
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
    fontSize: 13.5,
    fontWeight: '700',
    marginLeft: 7,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 3,
  },
  metricDivider: {
    width: 1,
    height: 28,
  },
  alertBanner: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
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
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  healthyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    marginBottom: 10,
  },
  healthyText: {
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  historyInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  historyInfoText: {
    fontSize: 11,
    fontWeight: '500',
  },
  demoToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  demoControlsBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  demoExplainer: {
    fontSize: 11.5,
    marginBottom: 8,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
  },
  demoBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 5,
  },
  longevityAlertBanner: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  longevityAlertTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 2,
  },
  longevityAlertDesc: {
    fontSize: 11.5,
    color: '#E2E8F0',
    lineHeight: 16,
  },
  dismissAlertBtn: {
    padding: 4,
  },
  guardToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  guardLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  guardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  guardSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  sotCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  sotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sotTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sotHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sotRemainingTag: {
    fontSize: 11,
    fontWeight: '800',
  },
  sotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sotItem: {
    flex: 1,
    minWidth: '29%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
  },
  sotItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sotItemHours: {
    fontSize: 13,
    fontWeight: '800',
  },
  sotItemLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  sotItemRate: {
    fontSize: 9.5,
    fontWeight: '500',
  },
});
