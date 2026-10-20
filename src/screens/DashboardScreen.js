import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SectionCard } from '../components/SectionCard';
import { StatBadge } from '../components/StatBadge';
import { HardwarePassportModal } from '../components/HardwarePassportModal';
import { ExplainerModal } from '../components/ExplainerModal';
import { useTheme } from '../context/ThemeContext';
import { formatBytes, formatBatteryLevel, formatUptime } from '../utils/formatters';
import { estimateBatteryTemperature } from '../utils/batteryThermal';

export function DashboardScreen({
  hardware,
  networkInfo,
  batteryData,
  onNavigate,
  onCopyReport,
}) {
  const { theme, isDark } = useTheme();
  const [passportVisible, setPassportVisible] = useState(false);
  const [explainerTopic, setExplainerTopic] = useState(null);

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
      {/* 1. Hero Summary Card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
          theme.cardShadow,
        ]}
      >
        <View style={styles.heroTopRow}>
          <View style={[styles.heroDeviceIcon, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="phone-portrait-outline" size={24} color={theme.primary} />
          </View>
          <View style={styles.heroDeviceInfo}>
            <Text style={[styles.heroModelText, { color: theme.textPrimary }]} numberOfLines={1}>
              {hardware.modelName || 'Android Device'}
            </Text>
            <Text style={[styles.heroBrandText, { color: theme.textSecondary }]}>
              {hardware.brand ? hardware.brand.toUpperCase() : 'MOBILE'} • {hardware.osName} {hardware.osVersion}
            </Text>
          </View>
          <StatBadge
            label={hardware.isDevice ? 'Verified Device' : 'Simulator'}
            variant={hardware.isDevice ? 'success' : 'warning'}
            size="small"
          />
        </View>

        {/* Friendly Subtitle & Live Status */}
        <View style={[styles.heroStatusBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9' }]}>
          <View style={styles.statusLeft}>
            <Ionicons name="checkmark-circle" size={17} color={theme.success} />
            <Text style={[styles.statusText, { color: theme.textPrimary }]}>
              All core systems operating nominally
            </Text>
          </View>
        </View>

        {/* Uptime and Thermal Status Bar */}
        <View style={[styles.heroSubBar, { borderTopColor: theme.divider }]}>
          <View style={styles.heroSubItem}>
            <Ionicons name="time-outline" size={13} color={theme.textMuted} />
            <Text style={[styles.heroSubText, { color: theme.textSecondary }]}>
              Uptime: {formatUptime(hardware.uptime)}
            </Text>
          </View>

          <View style={[styles.heroSubDivider, { backgroundColor: theme.divider }]} />

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
          style={[
            styles.alertCard,
            {
              backgroundColor: theme.dangerBg,
              borderColor: `${theme.danger}44`,
            },
          ]}
          onPress={() => handleAction('battery')}
          activeOpacity={0.8}
        >
          <Ionicons name="warning-outline" size={20} color={theme.danger} style={styles.alertIcon} />
          <View style={styles.alertContent}>
            <Text style={[styles.alertHeading, { color: theme.danger }]}>Rapid Battery Drain Detected</Text>
            <Text style={[styles.alertSub, { color: theme.textSecondary }]}>
              Consumption rate is elevated ({batteryData.drainRatePerHour?.toFixed(1)}%/hr). Tap to view battery details.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.danger} />
        </TouchableOpacity>
      )}

      {/* 3. The 4 Friendly Telemetry Cards */}
      <View style={styles.matrixGrid}>
        {/* Memory Box */}
        <TouchableOpacity
          style={[
            styles.matrixBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
            theme.cardShadow,
          ]}
          onPress={() => handleAction('hardware')}
          activeOpacity={0.75}
        >
          <View style={styles.matrixBoxHeader}>
            <View style={[styles.matrixIconCircle, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="hardware-chip-outline" size={16} color={theme.primary} />
            </View>
            <Text style={[styles.matrixBoxLabel, { color: theme.textMuted }]}>MEMORY</Text>
            <TouchableOpacity
              onPress={() => setExplainerTopic('memory_ram_vs_storage')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginLeft: 'auto' }}
            >
              <Ionicons name="help-circle-outline" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.matrixBoxValue, { color: theme.textPrimary }]}>
            {formatBytes(hardware.totalMemory, 1)}
          </Text>
          <Text style={[styles.matrixBoxSub, { color: theme.textSecondary }]}>
            {hardware.maxMemory ? `Heap: ${formatBytes(hardware.maxMemory, 1)}` : 'Physical RAM'}
          </Text>
        </TouchableOpacity>

        {/* Battery & Thermal Box */}
        <TouchableOpacity
          style={[
            styles.matrixBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
            theme.cardShadow,
          ]}
          onPress={() => handleAction('battery')}
          activeOpacity={0.75}
        >
          <View style={styles.matrixBoxHeader}>
            <View
              style={[
                styles.matrixIconCircle,
                {
                  backgroundColor: isCharging
                    ? theme.primaryLight
                    : percentage <= 20
                    ? theme.dangerBg
                    : theme.successBg,
                },
              ]}
            >
              <Ionicons
                name={isCharging ? 'flash' : 'battery-charging'}
                size={16}
                color={
                  isCharging
                    ? theme.primary
                    : percentage <= 20
                    ? theme.danger
                    : theme.success
                }
              />
            </View>
            <Text style={[styles.matrixBoxLabel, { color: theme.textMuted }]}>BATTERY</Text>
            <TouchableOpacity
              onPress={() => setExplainerTopic('battery_80_guard')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginLeft: 'auto' }}
            >
              <Ionicons name="help-circle-outline" size={16} color={theme.success} />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.matrixBoxValue,
              { color: isCharging ? theme.primary : theme.textPrimary },
            ]}
          >
            {formatBatteryLevel(batteryData.batteryLevel)}
          </Text>
          <Text style={[styles.matrixBoxSub, { color: theme.textSecondary }]}>
            {thermal.celsius}°C • {isCharging ? 'Charging' : 'Normal'}
          </Text>
        </TouchableOpacity>

        {/* Network Box */}
        <TouchableOpacity
          style={[
            styles.matrixBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
            theme.cardShadow,
          ]}
          onPress={() => handleAction('network')}
          activeOpacity={0.75}
        >
          <View style={styles.matrixBoxHeader}>
            <View style={[styles.matrixIconCircle, { backgroundColor: theme.secondaryLight }]}>
              <Ionicons name="wifi-outline" size={16} color={theme.secondary} />
            </View>
            <Text style={[styles.matrixBoxLabel, { color: theme.textMuted }]}>NETWORK</Text>
          </View>
          <Text
            style={[styles.matrixBoxValue, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {networkInfo.connectionType || 'OFFLINE'}
          </Text>
          <Text
            style={[styles.matrixBoxSub, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {networkInfo.ipAddress || 'Checking IP...'}
          </Text>
        </TouchableOpacity>

        {/* Storage Box */}
        <TouchableOpacity
          style={[
            styles.matrixBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
            theme.cardShadow,
          ]}
          onPress={() => handleAction('hardware')}
          activeOpacity={0.75}
        >
          <View style={styles.matrixBoxHeader}>
            <View style={[styles.matrixIconCircle, { backgroundColor: theme.warningBg }]}>
              <Ionicons name="folder-outline" size={16} color={theme.warning} />
            </View>
            <Text style={[styles.matrixBoxLabel, { color: theme.textMuted }]}>STORAGE</Text>
            <TouchableOpacity
              onPress={() => setExplainerTopic('memory_ram_vs_storage')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginLeft: 'auto' }}
            >
              <Ionicons name="help-circle-outline" size={16} color={theme.warning} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.matrixBoxValue, { color: theme.textPrimary }]}>
            {hardware.freeStorage ? `${formatBytes(hardware.freeStorage, 0)} Free` : 'Standard'}
          </Text>
          <Text style={[styles.matrixBoxSub, { color: theme.textSecondary }]}>
            {hardware.totalStorage ? `${storagePercent}% Used of ${formatBytes(hardware.totalStorage, 0)}` : 'Internal'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Quick Actions Hub */}
      <SectionCard
        icon="sparkles-outline"
        iconColor={theme.primary}
        title="Quick Diagnostic Tools"
        subtitle="One-tap hardware checks & utilities"
      >
        <TouchableOpacity
          style={[styles.actionHubItem, { borderBottomColor: theme.divider }]}
          onPress={() => handleAction('lab')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: theme.accentLight }]}>
            <Ionicons name="radio-outline" size={20} color={theme.accent} />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={[styles.actionHubTitle, { color: theme.textPrimary }]}>
              Haptic & Vibration Motor Test
            </Text>
            <Text style={[styles.actionHubDesc, { color: theme.textSecondary }]}>
              Test tactile actuator feedback with real-time visual ripple monitor.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionHubItem, { borderBottomColor: theme.divider }]}
          onPress={() => handleAction('battery')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: theme.warningBg }]}>
            <Ionicons name="thermometer-outline" size={20} color={theme.warning} />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={[styles.actionHubTitle, { color: theme.textPrimary }]}>
              Battery Thermal Analysis
            </Text>
            <Text style={[styles.actionHubDesc, { color: theme.textSecondary }]}>
              Monitor core temperature, thermal safety spectrum & battery advice.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionHubItem, { borderBottomColor: theme.divider }]}
          onPress={() => handleAction('lab')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="scan-outline" size={20} color={theme.primary} />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={[styles.actionHubTitle, { color: theme.textPrimary }]}>
              Screen Dead-Pixel & Sensor Lab
            </Text>
            <Text style={[styles.actionHubDesc, { color: theme.textSecondary }]}>
              Full-screen RGBW pixel test and live 3-axis accelerometer gravity horizon.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionHubItem, { borderBottomColor: theme.divider }]}
          onPress={() => setPassportVisible(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={[styles.actionHubTitle, { color: theme.textPrimary }]}>
              Used-Phone Hardware Passport
            </Text>
            <Text style={[styles.actionHubDesc, { color: theme.textSecondary }]}>
              Certified Grade A+ digital inspection card for buyers, sellers & audits.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#F59E0B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionHubItem}
          onPress={onCopyReport}
          activeOpacity={0.7}
        >
          <View style={[styles.actionHubIcon, { backgroundColor: theme.secondaryLight }]}>
            <Ionicons name="document-text-outline" size={20} color={theme.secondary} />
          </View>
          <View style={styles.actionHubContent}>
            <Text style={[styles.actionHubTitle, { color: theme.textPrimary }]}>
              Copy Full Technical Report
            </Text>
            <Text style={[styles.actionHubDesc, { color: theme.textSecondary }]}>
              Share complete hardware & network specs to your clipboard.
            </Text>
          </View>
          <Ionicons name="copy-outline" size={18} color={theme.secondary} />
        </TouchableOpacity>
      </SectionCard>

      {/* Hardware Passport Modal */}
      <HardwarePassportModal
        visible={passportVisible}
        onClose={() => setPassportVisible(false)}
        hardware={hardware}
        batteryData={batteryData}
        networkInfo={networkInfo}
      />

      {/* Plain-English Explainer Modal */}
      <ExplainerModal
        visible={!!explainerTopic}
        topicKey={explainerTopic}
        onClose={() => setExplainerTopic(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroDeviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroDeviceInfo: {
    flex: 1,
  },
  heroModelText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroBrandText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  heroStatusBox: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 7,
  },
  heroSubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  heroSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSubText: {
    fontSize: 11.5,
    marginLeft: 6,
    fontWeight: '500',
  },
  heroSubDivider: {
    width: 1,
    height: 14,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  alertSub: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  matrixBox: {
    flex: 1,
    minWidth: '46%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  matrixBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  matrixIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  matrixBoxLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  matrixBoxValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.4,
  },
  matrixBoxSub: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  actionHubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  actionHubIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionHubContent: {
    flex: 1,
    paddingRight: 8,
  },
  actionHubTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  actionHubDesc: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
});
