import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { SectionCard } from './SectionCard';
import { StatBadge } from './StatBadge';
import { COLORS } from '../styles/theme';

export function SensorMotionCard() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isActive, setIsActive] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    let subscription = null;

    async function initSensors() {
      try {
        const available = await Accelerometer.isAvailableAsync();
        setIsAvailable(available);
        if (!available) return;

        Accelerometer.setUpdateInterval(120); // 120ms updates for smooth performance

        if (isActive) {
          subscription = Accelerometer.addListener((accelData) => {
            setData(accelData);
          });
        }
      } catch (e) {
        setIsAvailable(false);
      }
    }

    initSensors();

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [isActive]);

  const { x, y, z } = data;

  // Compute roll & pitch angles in degrees
  const pitch = Math.round(Math.atan2(-x, Math.sqrt(y * y + z * z)) * (180 / Math.PI));
  const roll = Math.round(Math.atan2(y, z) * (180 / Math.PI));

  // Bubble level offset within 80px container
  const bubbleX = Math.min(28, Math.max(-28, Math.round(x * 28)));
  const bubbleY = Math.min(28, Math.max(-28, Math.round(-y * 28)));

  const isLevel = Math.abs(x) < 0.06 && Math.abs(y) < 0.06;

  return (
    <SectionCard
      icon="compass-outline"
      iconColor={COLORS.primary}
      title="Motion & Gravity Sensor"
      subtitle="3-Axis accelerometer & tilt horizon"
      accentColor={COLORS.primary}
      badge={<StatBadge label={isActive ? 'REAL-TIME' : 'PAUSED'} variant={isActive ? 'cyan' : 'neutral'} size="small" />}
    >
      <View style={styles.bubbleRow}>
        {/* Real-Time Bubble Level Horizon */}
        <View style={styles.bubbleRadarContainer}>
          <View style={[styles.bubbleRadar, isLevel && styles.bubbleRadarLevel]}>
            {/* Target Crosshairs */}
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />
            <View style={styles.targetCenter} />

            {/* Floating Bubble */}
            <View
              style={[
                styles.bubbleDot,
                isLevel && styles.bubbleDotLevel,
                {
                  transform: [{ translateX: bubbleX }, { translateY: bubbleY }],
                },
              ]}
            />
          </View>
          <Text style={styles.radarLabel}>
            {isLevel ? 'PERFECTLY LEVEL' : 'TILT HORIZON'}
          </Text>
        </View>

        {/* 3-Axis Metric Values */}
        <View style={styles.axisMetricsColumn}>
          <View style={styles.axisItem}>
            <Text style={styles.axisLabel}>X-Axis (Lateral)</Text>
            <Text style={styles.axisValue}>{x.toFixed(2)} g</Text>
          </View>

          <View style={styles.axisItem}>
            <Text style={styles.axisLabel}>Y-Axis (Longitudinal)</Text>
            <Text style={styles.axisValue}>{y.toFixed(2)} g</Text>
          </View>

          <View style={styles.axisItem}>
            <Text style={styles.axisLabel}>Z-Axis (Vertical)</Text>
            <Text style={styles.axisValue}>{z.toFixed(2)} g</Text>
          </View>

          <View style={styles.anglesRow}>
            <Text style={styles.angleText}>Pitch: {pitch}°</Text>
            <Text style={styles.angleText}>Roll: {roll}°</Text>
          </View>
        </View>
      </View>

      {/* Sensor Pause / Resume Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setIsActive(!isActive)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isActive ? 'pause-outline' : 'play-outline'}
            size={14}
            color={COLORS.primary}
          />
          <Text style={styles.toggleBtnText}>
            {isActive ? 'Pause Sensor Feed' : 'Resume Live Sensor Feed'}
          </Text>
        </TouchableOpacity>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bubbleRadarContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  bubbleRadar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubbleRadarLevel: {
    borderColor: COLORS.success,
  },
  crosshairH: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
  },
  crosshairV: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
  },
  targetCenter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.6)',
  },
  bubbleDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00F2FE',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  bubbleDotLevel: {
    backgroundColor: COLORS.success,
    shadowColor: COLORS.success,
  },
  radarLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginTop: 6,
  },
  axisMetricsColumn: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.35)',
  },
  axisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  axisLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  axisValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  anglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
    paddingTop: 6,
    marginTop: 4,
  },
  angleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  toggleRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 6,
  },
});

