import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { SectionCard } from './SectionCard';
import { StatBadge } from './StatBadge';
import { useTheme } from '../context/ThemeContext';

export function SensorMotionCard() {
  const { theme, isDark } = useTheme();

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

        Accelerometer.setUpdateInterval(100);

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
      iconColor={theme.primary}
      title="Gravity & Motion Sensor"
      subtitle="3-Axis accelerometer & precision bubble level"
      badge={<StatBadge label={isActive ? 'Live' : 'Paused'} variant={isActive ? 'primary' : 'neutral'} size="small" />}
    >
      <View style={styles.bubbleRow}>
        {/* Real-Time Bubble Level Horizon */}
        <View style={styles.bubbleRadarContainer}>
          <View
            style={[
              styles.bubbleRadar,
              {
                backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : '#F1F5F9',
                borderColor: isLevel ? theme.success : theme.cardBorder,
              },
            ]}
          >
            {/* Target Crosshairs */}
            <View style={[styles.crosshairH, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]} />
            <View style={[styles.crosshairV, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]} />
            <View
              style={[
                styles.targetCenter,
                { borderColor: isLevel ? theme.success : theme.primary },
              ]}
            />

            {/* Floating Bubble */}
            <View
              style={[
                styles.bubbleDot,
                {
                  backgroundColor: isLevel ? theme.success : theme.primary,
                  transform: [{ translateX: bubbleX }, { translateY: bubbleY }],
                },
              ]}
            />
          </View>
          <Text style={[styles.radarLabel, { color: isLevel ? theme.success : theme.textMuted }]}>
            {isLevel ? 'PERFECTLY FLAT' : 'TILT HORIZON'}
          </Text>
        </View>

        {/* 3-Axis Metric Values */}
        <View
          style={[
            styles.axisMetricsColumn,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.axisItem}>
            <Text style={[styles.axisLabel, { color: theme.textSecondary }]}>X-Axis (Lateral)</Text>
            <Text style={[styles.axisValue, { color: theme.textPrimary }]}>{x.toFixed(2)} g</Text>
          </View>

          <View style={styles.axisItem}>
            <Text style={[styles.axisLabel, { color: theme.textSecondary }]}>Y-Axis (Vertical)</Text>
            <Text style={[styles.axisValue, { color: theme.textPrimary }]}>{y.toFixed(2)} g</Text>
          </View>

          <View style={styles.axisItem}>
            <Text style={[styles.axisLabel, { color: theme.textSecondary }]}>Z-Axis (Depth)</Text>
            <Text style={[styles.axisValue, { color: theme.textPrimary }]}>{z.toFixed(2)} g</Text>
          </View>

          <View style={[styles.anglesRow, { borderTopColor: theme.divider }]}>
            <Text style={[styles.angleText, { color: theme.primary }]}>Pitch: {pitch}°</Text>
            <Text style={[styles.angleText, { color: theme.primary }]}>Roll: {roll}°</Text>
          </View>
        </View>
      </View>

      {/* Sensor Pause / Resume Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            {
              backgroundColor: theme.primaryLight,
              borderColor: `${theme.primary}44`,
            },
          ]}
          onPress={() => setIsActive(!isActive)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isActive ? 'pause-outline' : 'play-outline'}
            size={14}
            color={theme.primary}
          />
          <Text style={[styles.toggleBtnText, { color: theme.primary }]}>
            {isActive ? 'Pause Motion Sensor' : 'Resume Live Feed'}
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
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  crosshairH: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 1,
  },
  crosshairV: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    width: 1,
  },
  targetCenter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    opacity: 0.6,
  },
  bubbleDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  radarLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 6,
  },
  axisMetricsColumn: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  axisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3.5,
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  axisValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  anglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 6,
    marginTop: 4,
  },
  angleText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  toggleRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  toggleBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    marginLeft: 6,
  },
});
