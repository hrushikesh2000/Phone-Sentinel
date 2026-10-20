import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Magnetometer, LightSensor } from 'expo-sensors';
import { SectionCard } from './SectionCard';
import { StatBadge } from './StatBadge';
import { useTheme } from '../context/ThemeContext';

export function EnvironmentSensorsCard() {
  const { theme, isDark } = useTheme();

  // Compass / Magnetometer State
  const [magData, setMagData] = useState({ x: 0, y: 0, z: 0 });
  const [magAvailable, setMagAvailable] = useState(true);
  const [magActive, setMagActive] = useState(true);

  // Light / Lux Sensor State
  const [luxData, setLuxData] = useState(null);
  const [lightAvailable, setLightAvailable] = useState(true);

  // Setup Magnetometer
  useEffect(() => {
    let magSub = null;

    async function initMag() {
      try {
        const available = await Magnetometer.isAvailableAsync();
        setMagAvailable(available);
        if (!available) return;

        Magnetometer.setUpdateInterval(100);
        if (magActive) {
          magSub = Magnetometer.addListener((data) => {
            setMagData(data);
          });
        }
      } catch (err) {
        setMagAvailable(false);
      }
    }

    initMag();

    return () => {
      if (magSub && typeof magSub.remove === 'function') {
        magSub.remove();
      }
    };
  }, [magActive]);

  // Setup Light Sensor
  useEffect(() => {
    let lightSub = null;

    async function initLight() {
      try {
        const available = await LightSensor.isAvailableAsync();
        setLightAvailable(available);
        if (!available) return;

        LightSensor.setUpdateInterval(250);
        lightSub = LightSensor.addListener((data) => {
          setLuxData(data.illuminance);
        });
      } catch (err) {
        setLightAvailable(false);
      }
    }

    initLight();

    return () => {
      if (lightSub && typeof lightSub.remove === 'function') {
        lightSub.remove();
      }
    };
  }, []);

  // Compute Compass heading (degrees relative to top of device pointing North)
  const { x, y, z } = magData;
  let heading = 0;
  if (magAvailable) {
    // In portrait orientation: +Y points toward top/earpiece, +X points right.
    // Navigational azimuth angle from top of device: Math.atan2(-x, y)
    const rad = Math.atan2(-x, y);
    let deg = Math.round(rad * (180 / Math.PI));
    // Normalize to 0-360 degrees
    heading = (deg + 360) % 360;
  }

  // Determine Cardinal direction
  const getCardinal = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  };

  // Magnetic Field Flux Magnitude (in microteslas uT)
  const magneticFlux = Math.round(Math.sqrt(x * x + y * y + z * z));

  // Determine ambient lighting description
  const getLuxClassification = (lux) => {
    if (lux === null || lux === undefined) return { label: 'Measuring...', zone: 'neutral' };
    if (lux < 5) return { label: 'Pitch Black / Night', zone: 'neutral', icon: 'moon-outline' };
    if (lux < 50) return { label: 'Dim Ambient Light', zone: 'neutral', icon: 'partly-sunny-outline' };
    if (lux < 300) return { label: 'Standard Indoor / Office', zone: 'primary', icon: 'bulb-outline' };
    if (lux < 1000) return { label: 'Bright Studio / Daylight', zone: 'success', icon: 'sunny-outline' };
    if (lux < 5000) return { label: 'Direct Sunlight / Outdoor', zone: 'warning', icon: 'flame-outline' };
    return { label: 'Intense Direct Beam', zone: 'danger', icon: 'flash-outline' };
  };

  const luxInfo = getLuxClassification(luxData);

  return (
    <SectionCard
      icon="navigate-circle-outline"
      iconColor="#00F2FE"
      title="Compass & Lux Sensor"
      subtitle="Geomagnetic 360° heading & ambient light photometer"
      badge={
        <StatBadge
          label={magAvailable ? `${heading}° ${getCardinal(heading)}` : 'Sensors'}
          variant="primary"
          size="small"
        />
      }
    >
      {/* 1. Compass Navigation Dial Hero */}
      <View
        style={[
          styles.compassCard,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.compassVisualWrap}>
          {/* Top Heading Reference Marker */}
          <View style={styles.lubberLine} />

          {/* Compass Rose Dial */}
          <View
            style={[
              styles.compassDial,
              {
                borderColor: theme.cardBorder,
                backgroundColor: isDark ? '#060B14' : '#E2E8F0',
                transform: [{ rotate: `${-heading}deg` }],
              },
            ]}
          >
            {/* North Indicator */}
            <View style={styles.needleNorth}>
              <View style={styles.needleNorthTip} />
              <Text style={styles.compassLetterN}>N</Text>
            </View>

            {/* South Indicator */}
            <View style={styles.needleSouth}>
              <Text style={styles.compassLetterS}>S</Text>
            </View>

            {/* East / West Markers */}
            <Text style={styles.compassLetterE}>E</Text>
            <Text style={styles.compassLetterW}>W</Text>

            {/* Center Pivot Point */}
            <View style={styles.compassPivot} />
          </View>
        </View>

        {/* Live Heading & Magnetic Flux Stats */}
        <View style={styles.headingStatsWrap}>
          <View style={styles.headingTopRow}>
            <Text style={[styles.headingDegree, { color: theme.textPrimary }]}>
              {magAvailable ? `${heading}°` : 'N/A'}
            </Text>
            <Text style={[styles.headingCardinal, { color: '#00F2FE' }]}>
              {magAvailable ? getCardinal(heading) : 'Sensors Disabled'}
            </Text>
          </View>

          <Text style={[styles.fluxSubText, { color: theme.textSecondary }]}>
            Magnetic Flux: {magAvailable ? `${magneticFlux} µT` : 'Unavailable'}
          </Text>

          {/* Earth field nominal indicator */}
          <View style={styles.fluxBadge}>
            <View
              style={[
                styles.fluxDot,
                {
                  backgroundColor:
                    magneticFlux >= 25 && magneticFlux <= 70 ? '#10B981' : '#F59E0B',
                },
              ]}
            />
            <Text style={styles.fluxBadgeText}>
              {magneticFlux >= 25 && magneticFlux <= 70
                ? 'Standard Earth Field'
                : 'Local Magnetism Offset'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Ambient Light / Photometer Gauge */}
      <View
        style={[
          styles.luxContainer,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.luxHeader}>
          <View style={styles.luxHeaderLeft}>
            <Ionicons
              name={luxInfo.icon || 'bulb-outline'}
              size={18}
              color={theme.warning}
            />
            <Text style={[styles.luxTitle, { color: theme.textPrimary }]}>
              Ambient Light Sensor
            </Text>
          </View>

          <Text style={[styles.luxValueText, { color: theme.textPrimary }]}>
            {lightAvailable && luxData !== null
              ? `${Math.round(luxData)} Lux`
              : lightAvailable
              ? 'Measuring...'
              : 'Sensor N/A'}
          </Text>
        </View>

        {/* Ambient Classification Label */}
        <Text style={[styles.luxClassLabel, { color: theme.textSecondary }]}>
          Environment: <Text style={{ color: '#00F2FE', fontWeight: '700' }}>{luxInfo.label}</Text>
        </Text>

        {/* Visual Lux Intensity Bar */}
        <View style={styles.luxBarTrack}>
          <View
            style={[
              styles.luxBarFill,
              {
                width: `${Math.min(100, Math.max(3, ((luxData || 0) / 1000) * 100))}%`,
                backgroundColor: theme.warning,
              },
            ]}
          />
        </View>

        <View style={styles.luxScaleLabels}>
          <Text style={styles.scaleText}>0 lx (Dark)</Text>
          <Text style={styles.scaleText}>500 lx (Office)</Text>
          <Text style={styles.scaleText}>1000+ lx (Sun)</Text>
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  compassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 16,
  },
  compassVisualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 6,
  },
  lubberLine: {
    position: 'absolute',
    top: 0,
    width: 3,
    height: 7,
    borderRadius: 1.5,
    backgroundColor: '#00F2FE',
    zIndex: 10,
  },
  compassDial: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  needleNorth: {
    position: 'absolute',
    top: 5,
    alignItems: 'center',
  },
  needleNorthTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EF4444',
  },
  compassLetterN: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 1,
  },
  needleSouth: {
    position: 'absolute',
    bottom: 6,
    alignItems: 'center',
  },
  compassLetterS: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '800',
  },
  compassLetterE: {
    position: 'absolute',
    right: 8,
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '800',
  },
  compassLetterW: {
    position: 'absolute',
    left: 8,
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '800',
  },
  compassPivot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00F2FE',
  },
  headingStatsWrap: {
    flex: 1,
  },
  headingTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  headingDegree: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headingCardinal: {
    fontSize: 16,
    fontWeight: '800',
  },
  fluxSubText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  fluxBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fluxDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  fluxBadgeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  luxContainer: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  luxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  luxHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  luxTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  luxValueText: {
    fontSize: 14,
    fontWeight: '800',
  },
  luxClassLabel: {
    fontSize: 11.5,
    marginBottom: 10,
  },
  luxBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 6,
  },
  luxBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  luxScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
});
