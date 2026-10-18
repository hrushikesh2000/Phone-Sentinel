import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SectionCard } from './SectionCard';
import { StatBadge } from './StatBadge';
import { COLORS } from '../styles/theme';
import { estimateBatteryTemperature, THERMAL_ZONES } from '../utils/batteryThermal';

export function BatteryThermalCard({ batteryData }) {
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [simulatedOffset, setSimulatedOffset] = useState(0);

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
      title="Battery Thermal Analysis"
      subtitle="Operating temperature & lithium chemistry safety"
      accentColor={thermalData.zone.color}
      badge={<StatBadge label={thermalData.zone.label} variant={thermalData.zone.variant} size="small" />}
    >
      {/* Hero Temperature Reading Box */}
      <View style={styles.heroRow}>
        <View style={styles.tempColumn}>
          <Text style={styles.tempSubLabel}>ESTIMATED BATTERY CORE</Text>
          <View style={styles.tempValueRow}>
            <Text style={[styles.tempNumber, { color: thermalData.zone.color }]}>
              {currentDisplayTemp}
            </Text>
            <TouchableOpacity style={styles.unitToggleBtn} onPress={toggleUnit} activeOpacity={0.7}>
              <Text style={styles.unitToggleText}>{unit === 'C' ? 'Switch to °F' : 'Switch to °C'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.zoneIconBox, { backgroundColor: `${thermalData.zone.color}20` }]}>
          <Ionicons
            name={thermalData.isOverheating ? 'flame' : 'thermometer'}
            size={28}
            color={thermalData.zone.color}
          />
        </View>
      </View>

      {/* Visual Thermal Spectrum Track */}
      <View style={styles.spectrumContainer}>
        <View style={styles.spectrumHeader}>
          <Text style={styles.spectrumMark}>20°C (Cold)</Text>
          <Text style={styles.spectrumMark}>35°C (Ideal)</Text>
          <Text style={styles.spectrumMark}>50°C (Hot)</Text>
        </View>

        <View style={styles.spectrumTrack}>
          {/* Gradient-like zones */}
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
              },
            ]}
          />
        </View>
      </View>

      {/* Contextual Thermal Health Advice */}
      <View style={styles.adviceCard}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={thermalData.zone.color}
          style={styles.adviceIcon}
        />
        <View style={styles.adviceContent}>
          <Text style={styles.adviceTitle}>Thermal Chemistry Impact</Text>
          <Text style={styles.adviceText}>{thermalData.zone.advice}</Text>
        </View>
      </View>

      {/* Thermal Decomposition Factors */}
      <View style={styles.factorsRow}>
        <View style={styles.factorItem}>
          <Text style={styles.factorLabel}>Charging Thermal</Text>
          <Text style={styles.factorValue}>
            {isCharging ? '+5.5°C' : '0.0°C (Off)'}
          </Text>
        </View>

        <View style={styles.factorDivider} />

        <View style={styles.factorItem}>
          <Text style={styles.factorLabel}>Discharge Heat</Text>
          <Text style={styles.factorValue}>
            {batteryData.drainRatePerHour && batteryData.drainRatePerHour > 18 ? '+4.2°C (High)' : '+1.2°C (Low)'}
          </Text>
        </View>

        <View style={styles.factorDivider} />

        <View style={styles.factorItem}>
          <Text style={styles.factorLabel}>Thermal Throttle</Text>
          <Text style={[styles.factorValue, thermalData.isOverheating && { color: COLORS.danger }]}>
            {thermalData.isOverheating ? 'Active Risk' : 'None'}
          </Text>
        </View>
      </View>

      {/* Interactive Simulation Controls */}
      <View style={styles.simControlsRow}>
        <TouchableOpacity
          style={styles.simBtn}
          onPress={() => setSimulatedOffset((prev) => (prev === 0 ? 12 : 0))}
          activeOpacity={0.7}
        >
          <Ionicons
            name={simulatedOffset > 0 ? 'refresh-outline' : 'flame-outline'}
            size={14}
            color={COLORS.primary}
          />
          <Text style={styles.simBtnText}>
            {simulatedOffset > 0 ? 'Reset Thermal State' : 'Simulate Heavy 3D Gaming Heat (+12°C)'}
          </Text>
        </TouchableOpacity>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },
  tempColumn: {
    flex: 1,
  },
  tempSubLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  tempValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  tempNumber: {
    fontSize: 26,
    fontWeight: '900',
    marginRight: 12,
  },
  unitToggleBtn: {
    backgroundColor: 'rgba(16, 27, 46, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unitToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  zoneIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spectrumContainer: {
    marginBottom: 12,
  },
  spectrumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  spectrumMark: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  spectrumTrack: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'visible',
    position: 'relative',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
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
    backgroundColor: '#070B14',
    borderWidth: 3,
    marginLeft: -9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  adviceCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.35)',
    marginBottom: 12,
  },
  adviceIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  adviceContent: {
    flex: 1,
  },
  adviceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  adviceText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  factorsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  factorItem: {
    flex: 1,
    alignItems: 'center',
  },
  factorLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  factorValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  factorDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
  },
  simControlsRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 6,
  },
});

