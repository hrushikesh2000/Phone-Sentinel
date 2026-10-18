import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SectionCard } from '../components/SectionCard';
import { StatBadge } from '../components/StatBadge';
import { COLORS } from '../styles/theme';
import { formatBytes, formatBatteryLevel, formatUptime } from '../utils/formatters';
import { estimateBatteryTemperature } from '../utils/batteryThermal';

export function DashboardScreen({
  hardware,
  networkInfo,
  batteryData,
  onNavigate,
  onCopyReport,
}) {
  const percentage = batteryData.batteryLevel !== null ? Math.round(batteryData.batteryLevel * 100) : 0;
  const isCharging = batteryData.batteryState === 2 || batteryData.batteryState === 3;

  // Temperature estimate
  const thermal = estimateBatteryTemperature({
    batteryLevel: batteryData.batteryLevel,
    isCharging,
    drainRatePerHour: batteryData.drainRatePerHour,
    isLowPowerMode: batteryData.lowPowerMode,
  });

  // Storage
  let storagePercent = 0;
  if (hardware.totalStorage && hardware.freeStorage && hardware.totalStorage > 0) {
    storagePercent = Math.round(((hardware.totalStorage - hardware.freeStorage) / hardware.totalStorage) * 100);
  }

  const handleAction = (tabId) => {
    try {
      Haptics.selectionAsync();
    } catch (e) {}
    onNavigate(tabId);
  };

  return (
    <View style={styles.container}>
      {/* 1. Hero Device Header Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroDeviceIcon}>
            <Ionicons name="phone-portrait" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.heroDeviceInfo}>
            <Text style={styles.heroModelText} numberOfLines={1}>
              {hardware.modelName || 'Mobile Terminal'}
            </Text>
            <Text style={styles.heroBrandText}>
              {hardware.brand ? hardware.brand.toUpperCase() : 'ANDROID'} • {hardware.osName} {hardware.osVersion}
            </Text>
          </View>
          <StatBadge
            label={hardware.isDevice ? 'HARDWARE' : 'SIMULATOR'}
            variant={hardware.isDevice ? 'success' : 'warning'}
            size="small"
          />
        </View>

        {/* Uptime and Thermal Status Bar */}
        <View style={styles.heroSubBar}>
          <View style={styles.heroSubItem}>
            <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.heroSubText}>Uptime: {formatUptime(hardware.uptime)}</Text>
          </View>

          <View style={styles.heroSubDivider} />

          <View style={styles.heroSubItem}>
            <Ionicons name="thermometer-outline" size={13} color={thermal.zone.color} />
            <Text style={[styles.heroSubText, { color: thermal.zone.color, fontWeight: '700' }]}>
              {thermal.celsius}°C • {thermal.zone.label.split('/')[0].trim()}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Critical Alert Banner (if abnormal drain detected) */}
      {batteryData.isDrainAbnormal && (
        <TouchableOpacity
          style={styles.alertCard}
          onPress={() => handleAction('battery')}
          activeOpacity={0.8}
        >
          <Ionicons name="warning" size={20} color={COLORS.danger} style={styles.alertIcon} />
          <View style={styles.alertContent}>
            <Text style={styles.alertHeading}>Abnormal Rapid Drain Detected!</Text>
            <Text style={styles.alertSub}>
              Discharge rate is elevated ({batteryData.drainRatePerHour?.toFixed(1)}%/hr). Tap to inspect battery telemetry.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.danger} />
        </TouchableOpacity>
      )}

      {/* 3. 4-Box Telemetry Matrix */}
      <View style={styles.matrixGrid}>
        {/* Memory Box */}
        <TouchableOpacity
          style={styles.matrixBox}
          onPress={() => handleAction('hardware')}
          activeOpacity={0.75}
        >
          <View style={styles.matrixBoxHeader}>
            <Ionicons name="hardware-chip-outline" size={18} color={COLORS.primary} />
            <Text style={styles.matrixBoxLabel}>RAM MEMORY</Text>
          </View>
          <Text style={styles.matrixBoxValue}>{formatBytes(hardware.totalMemory, 1)}</Text>
          <Text style={styles.matrixBoxSub}>
            {hardware.maxMemory ? `Heap: ${formatBytes(hardware.maxMemory, 1)}` : 'Physical RAM'}
          </Text>
        </TouchableOpacity>

        {/* Battery & Thermal Box */}
        <TouchableOpacity
          style={styles.matrixBox}
          onPress={() => handleAction('battery')}
          activeOpacity={0.75}
        >
          <View style={styles.matrixBoxHeader}>
            <Ionicons
              name={isCharging ? 'flash-outline' : 'battery-charging-outline'}
              size={18}
              color={isCharging ? COLORS.primary : percentage <= 20 ? COLORS.danger : COLORS.accent}
            />
            <Text style={styles.matrixBoxLabel}>BATTERY</Text>
          </View>
          <Text style={[styles.matrixBoxValue, isCharging && { color: COLORS.primary }]}>
            {formatBatteryLevel(batteryData.batteryLevel)}
          </Text>
          <Text style={styles.matrixBoxSub}>
            {thermal.celsius}°C • {isCharging ? 'Charging' : 'Nominal'}
          </Text>
        </TouchableOpacity>

        {/* Network Box */}
        <TouchableOpacity
          style={styles.matrixBox}
          onPress={() => handleAction('network')}
          activeOpacity={0.75}
        >
          <View style={styles.matrixBoxHeader}>
            <Ionicons name="wifi-outline" size={18} color={COLORS.secondary} />
            <Text style={styles.matrixBoxLabel}>NETWORK</Text>
          </View>
          <Text style={styles.matrixBoxValue} numberOfLines={1}>
            {networkInfo.connectionType || 'OFFLINE'}
          </Text>
          <Text style={styles.matrixBoxSub} numberOfLines={1}>
            {networkInfo.ipAddress || 'Unavailable'}
          </Text>
        </TouchableOpacity>

        {/* Storage Box */}
        <TouchableOpacity
          style={styles.matrixBox}
          onPress={() => handleAction('hardware')}
          activeOpacity={0.75}
        >
          <View style={styles.matrixBoxHeader}>
            <Ionicons name="folder-outline" size={18} color={COLORS.warning} />
            <Text style={styles.matrixBoxLabel}>STORAGE</Text>
          </View>
          <Text style={styles.matrixBoxValue}>
            {hardware.freeStorage ? `${formatBytes(hardware.freeStorage, 0)} Free` : 'Standard'}
          </Text>
          <Text style={styles.matrixBoxSub}>
            {hardware.totalStorage ? `${storagePercent}% Used of ${formatBytes(hardware.totalStorage, 0)}` : 'Internal'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Quick Action Command Hub */}
      <SectionCard
        icon="apps-outline"
        iconColor={COLORS.primary}
        title="Diagnostic Control Center"
        subtitle="Quick access to system testing tools"
        accentColor={COLORS.primary}
      >
        <TouchableOpacity
          style={styles.actionHubItem}
          onPress={() => handleAction('lab')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: 'rgba(20, 184, 166, 0.12)' }]}>
            <Ionicons name="radio-outline" size={20} color={COLORS.accent} />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={styles.actionHubTitle}>Haptic & Vibration Motor Test</Text>
            <Text style={styles.actionHubDesc}>Test tactile actuator feedback with live visual ripple monitor.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionHubItem}
          onPress={() => handleAction('battery')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
            <Ionicons name="thermometer-outline" size={20} color={COLORS.warning} />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={styles.actionHubTitle}>Battery Thermal & Temperature Analysis</Text>
            <Text style={styles.actionHubDesc}>Monitor cell temperature, thermal throttle risks & safety advice.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionHubItem}
          onPress={() => handleAction('lab')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: 'rgba(0, 242, 254, 0.12)' }]}>
            <Ionicons name="scan-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={styles.actionHubTitle}>Display Dead-Pixel & Sensor Lab</Text>
            <Text style={styles.actionHubDesc}>RGBW dead-pixel inspection and 3-axis accelerometer gravity horizon.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionHubItem}
          onPress={onCopyReport}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
            <Ionicons name="clipboard-outline" size={20} color={COLORS.secondary} />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={styles.actionHubTitle}>Export Diagnostics Report</Text>
            <Text style={styles.actionHubDesc}>Copy comprehensive hardware specs to clipboard.</Text>
          </View>
          <Ionicons name="copy-outline" size={18} color={COLORS.secondary} />
        </TouchableOpacity>
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroDeviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  heroDeviceInfo: {
    flex: 1,
  },
  heroModelText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  heroBrandText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  heroSubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
  },
  heroSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSubText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
  heroSubDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  alertIcon: {
    marginRight: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.danger,
    marginBottom: 2,
  },
  alertSub: {
    fontSize: 11,
    color: '#FECDD3',
    lineHeight: 15,
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  matrixBox: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
  },
  matrixBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matrixBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  matrixBoxValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  matrixBoxSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  actionHubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  actionHubIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionHubContent: {
    flex: 1,
    paddingRight: 8,
  },
  actionHubTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionHubDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
