import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SectionCard } from './SectionCard';
import { StatBadge } from './StatBadge';
import { ExplainerModal } from './ExplainerModal';
import { useTheme } from '../context/ThemeContext';
import { estimateBatteryTemperature } from '../utils/batteryThermal';

export function BatteryThermalCard({ batteryData }) {
  const { theme, isDark } = useTheme();
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [simulatedOffset, setSimulatedOffset] = useState(0);
  const [explainerVisible, setExplainerVisible] = useState(false);

  const isCharging = batteryData.batteryState === 2 || batteryData.batteryState === 3;

  const thermalData = estimateBatteryTemperature({
    batteryLevel: batteryData.batteryLevel,
    isCharging,
    drainRatePerHour: batteryData.drainRatePerHour,
    isLowPowerMode: batteryData.lowPowerMode,
    offset: simulatedOffset,
  });

  const toggleUnit = () => {
    try {
      Haptics.selectionAsync();
    } catch (e) {}
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const currentDisplayTemp =
    unit === 'C' ? `${thermalData.celsius}°C` : `${thermalData.fahrenheit}°F`;

  // Calculate percentage along thermal scale (20°C to 50°C)
  const clampedC = Math.min(50, Math.max(20, thermalData.celsius));
  const pointerPercent = Math.round(((clampedC - 20) / (50 - 20)) * 100);

  return (
    <SectionCard
      icon="thermometer-outline"
      iconColor={thermalData.zone.color}
      title="Battery Temperature"
      subtitle="Operating thermal health & safety spectrum"
      badge={<StatBadge label={thermalData.zone.label} variant={thermalData.zone.variant} size="small" />}
      onHelpPress={() => setExplainerVisible(true)}
    >
      {/* Hero Temperature Reading Box */}
      <View
        style={[
          styles.heroRow,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.tempColumn}>
          <Text style={[styles.tempSubLabel, { color: theme.textMuted }]}>
            BATTERY CORE TEMPERATURE
          </Text>
          <View style={styles.tempValueRow}>
            <Text style={[styles.tempNumber, { color: thermalData.zone.color }]}>
              {currentDisplayTemp}
            </Text>
            <TouchableOpacity
              style={[
                styles.unitToggleBtn,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}
              onPress={toggleUnit}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitToggleText, { color: theme.primary }]}>
                {unit === 'C' ? 'View in °F' : 'View in °C'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.zoneIconBox, { backgroundColor: `${thermalData.zone.color}18` }]}>
          <Ionicons
            name={thermalData.isOverheating ? 'flame' : 'thermometer'}
            size={26}
            color={thermalData.zone.color}
          />
        </View>
      </View>

      {/* Visual Thermal Spectrum Track */}
      <View style={styles.spectrumContainer}>
        <View style={styles.spectrumHeader}>
          <Text style={[styles.spectrumMark, { color: theme.textMuted }]}>20°C (Cool ❄️)</Text>
          <Text style={[styles.spectrumMark, { color: theme.textMuted }]}>35°C (Optimal 🌿)</Text>
          <Text style={[styles.spectrumMark, { color: theme.textMuted }]}>50°C (Hot 🔥)</Text>
        </View>

        <View style={[styles.spectrumTrack, { backgroundColor: theme.trackBg }]}>
          {/* Friendly colored thermal zones */}
          <View style={[styles.zoneSection, { backgroundColor: '#38BDF8', flex: 1.5 }]} />
          <View style={[styles.zoneSection, { backgroundColor: '#10B981', flex: 2 }]} />
          <View style={[styles.zoneSection, { backgroundColor: '#F59E0B', flex: 2 }]} />
          <View style={[styles.zoneSection, { backgroundColor: '#F43F5E', flex: 1.5 }]} />

          {/* Current Pointer Indicator */}
          <View
            style={[
              styles.pointer,
              {
                left: `${pointerPercent}%`,
                borderColor: thermalData.zone.color,
                backgroundColor: theme.card,
              },
            ]}
          />
        </View>
      </View>

      {/* Contextual Thermal Health Advice */}
      <View
        style={[
          styles.adviceCard,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={thermalData.zone.color}
          style={styles.adviceIcon}
        />
        <View style={styles.adviceContent}>
          <Text style={[styles.adviceTitle, { color: theme.textPrimary }]}>
            Battery Chemistry Health
          </Text>
          <Text style={[styles.adviceText, { color: theme.textSecondary }]}>
            {thermalData.zone.advice}
          </Text>
        </View>
      </View>

      {/* Thermal Factors */}
      <View
        style={[
          styles.factorsRow,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.factorItem}>
          <Text style={[styles.factorLabel, { color: theme.textMuted }]}>Charging Heat</Text>
          <Text style={[styles.factorValue, { color: theme.textPrimary }]}>
            {isCharging ? '+5.5°C' : '0.0°C (Normal)'}
          </Text>
        </View>

        <View style={[styles.factorDivider, { backgroundColor: theme.divider }]} />

        <View style={styles.factorItem}>
          <Text style={[styles.factorLabel, { color: theme.textMuted }]}>Discharge Load</Text>
          <Text style={[styles.factorValue, { color: theme.textPrimary }]}>
            {batteryData.drainRatePerHour && batteryData.drainRatePerHour > 18 ? '+4.2°C (High)' : '+1.2°C (Low)'}
          </Text>
        </View>

        <View style={[styles.factorDivider, { backgroundColor: theme.divider }]} />

        <View style={styles.factorItem}>
          <Text style={[styles.factorLabel, { color: theme.textMuted }]}>Thermal Throttle</Text>
          <Text style={[styles.factorValue, { color: thermalData.isOverheating ? theme.danger : theme.success }]}>
            {thermalData.isOverheating ? 'Active Risk' : 'None'}
          </Text>
        </View>
      </View>

      {/* Simulation Controls */}
      <View style={styles.simControlsRow}>
        <TouchableOpacity
          style={[
            styles.simBtn,
            {
              backgroundColor: theme.primaryLight,
              borderColor: `${theme.primary}44`,
            },
          ]}
          onPress={() => setSimulatedOffset((prev) => (prev === 0 ? 12 : 0))}
          activeOpacity={0.7}
        >
          <Ionicons
            name={simulatedOffset > 0 ? 'refresh-outline' : 'flame-outline'}
            size={14}
            color={theme.primary}
          />
          <Text style={[styles.simBtnText, { color: theme.primary }]}>
            {simulatedOffset > 0 ? 'Reset Thermal Model' : 'Simulate Heavy 3D Gaming Heat (+12°C)'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Plain-English Thermal Explainer */}
      <ExplainerModal
        visible={explainerVisible}
        topicKey="battery_thermal"
        onClose={() => setExplainerVisible(false)}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  tempColumn: {
    flex: 1,
  },
  tempSubLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tempValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  tempNumber: {
    fontSize: 26,
    fontWeight: '800',
    marginRight: 10,
    letterSpacing: -0.4,
  },
  unitToggleBtn: {
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  unitToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  zoneIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spectrumContainer: {
    marginBottom: 14,
  },
  spectrumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  spectrumMark: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  spectrumTrack: {
    height: 8,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'visible',
    position: 'relative',
  },
  zoneSection: {
    height: '100%',
  },
  pointer: {
    position: 'absolute',
    top: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    marginLeft: -9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  adviceCard: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  adviceIcon: {
    marginRight: 9,
    marginTop: 2,
  },
  adviceContent: {
    flex: 1,
  },
  adviceTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  adviceText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  factorsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
  },
  factorItem: {
    flex: 1,
    alignItems: 'center',
  },
  factorLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  factorValue: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  factorDivider: {
    width: 1,
    height: 24,
  },
  simControlsRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  simBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    marginLeft: 6,
  },
});
