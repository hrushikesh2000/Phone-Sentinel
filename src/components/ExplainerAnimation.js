import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ExplainerAnimation({ type = 'speaker_cone', color = '#00F2FE' }) {
  // Animation drivers
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const wave1Anim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(0.4)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Continuous gentle cone/balloon pulsing
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Sound waves radiating outward
    const waveLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(wave1Anim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(wave1Anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(450),
          Animated.timing(wave2Anim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(wave2Anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // 3. Battery charging fill
    const fillLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(fillAnim, {
          toValue: 0.8,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.delay(1000),
        Animated.timing(fillAnim, {
          toValue: 0.35,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    // 4. Compass rotation
    const spinLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(spinAnim, {
          toValue: -1,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 5. Dead pixel blink
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    waveLoop.start();
    fillLoop.start();
    spinLoop.start();
    blinkLoop.start();

    return () => {
      pulseLoop.stop();
      waveLoop.stop();
      fillLoop.stop();
      spinLoop.stop();
      blinkLoop.stop();
    };
  }, []);

  // 1. Speaker Cone & Acoustic Waves Animation
  if (type === 'speaker_cone') {
    return (
      <View style={styles.animCanvas}>
        <View style={styles.sceneContainer}>
          {/* Animated Speaker Box */}
          <Animated.View
            style={[
              styles.speakerBox,
              {
                borderColor: color,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={[styles.speakerConeCenter, { backgroundColor: color }]}>
              <Ionicons name="volume-high" size={24} color="#070B14" />
            </View>
          </Animated.View>

          {/* Sound Waves Radiating Out */}
          <View style={styles.wavesWrapper}>
            <Animated.View
              style={[
                styles.soundWaveArc,
                {
                  borderColor: color,
                  opacity: wave1Anim.interpolate({
                    inputRange: [0, 0.7, 1],
                    outputRange: [1, 0.5, 0],
                  }),
                  transform: [
                    {
                      scale: wave1Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 1.6],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.soundWaveArc,
                {
                  borderColor: color,
                  opacity: wave2Anim.interpolate({
                    inputRange: [0, 0.7, 1],
                    outputRange: [1, 0.5, 0],
                  }),
                  transform: [
                    {
                      scale: wave2Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 1.8],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
        <Text style={styles.animCaption}>
          Oscillating Sound Diaphragm: Slow for Bass (250Hz) • Fast for Treble (8kHz)
        </Text>
      </View>
    );
  }

  // 2. Battery Balloon & Longevity 80% Buffer Animation
  if (type === 'battery_balloon') {
    return (
      <View style={styles.animCanvas}>
        <View style={styles.sceneContainer}>
          <View style={styles.batteryShell}>
            {/* Battery Terminal Pin */}
            <View style={styles.batteryPin} />

            {/* Dynamic Liquid Level */}
            <Animated.View
              style={[
                styles.batteryLiquidFill,
                {
                  height: fillAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: fillAnim.interpolate({
                    inputRange: [0, 0.79, 0.81, 1],
                    outputRange: ['#10B981', '#10B981', '#F59E0B', '#EF4444'],
                  }),
                },
              ]}
            />

            {/* 80% Optimal Threshold Line */}
            <View style={styles.batteryThresholdLine}>
              <View style={styles.safeZoneBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                <Text style={styles.safeZoneText}>80% Optimal Cap</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.animCaption}>
          Stays in Green Health Zone (0–80%) • Avoids High-Voltage Stress (>80%)
        </Text>
      </View>
    );
  }

  // 3. Screen Dead Pixel Grid Inspection Animation
  if (type === 'pixel_grid') {
    return (
      <View style={styles.animCanvas}>
        <View style={styles.pixelMatrixBox}>
          {[0, 1, 2, 3].map((row) => (
            <View key={`p_row_${row}`} style={styles.pixelRow}>
              {[0, 1, 2, 3, 4, 5].map((col) => {
                const isDead = row === 1 && col === 3;
                if (isDead) {
                  return (
                    <Animated.View
                      key={`p_col_${col}`}
                      style={[
                        styles.pixelSubDot,
                        styles.deadPixelDot,
                        { opacity: blinkAnim },
                      ]}
                    >
                      <Ionicons name="close" size={9} color="#EF4444" />
                    </Animated.View>
                  );
                }
                return (
                  <View
                    key={`p_col_${col}`}
                    style={[styles.pixelSubDot, { backgroundColor: color }]}
                  />
                );
              })}
            </View>
          ))}
        </View>
        <Text style={styles.animCaption}>
          Microscopic Pixels Glowing • One Broken Pixel Sticks Out Dark / Defective
        </Text>
      </View>
    );
  }

  // 4. RAM vs Flash Storage Animation
  if (type === 'ram_desk') {
    return (
      <View style={styles.animCanvas}>
        <View style={styles.storageCompareRow}>
          {/* Active Desk (RAM) */}
          <View style={styles.compareBox}>
            <View style={[styles.compareIconCircle, { backgroundColor: 'rgba(0, 242, 254, 0.15)' }]}>
              <Ionicons name="desktop-outline" size={20} color="#00F2FE" />
            </View>
            <Text style={styles.compareTitle}>RAM (Memory)</Text>
            <Text style={styles.compareSub}>Your Active Desk</Text>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>High Speed Workspace</Text>
            </View>
          </View>

          <Ionicons name="swap-horizontal" size={24} color="#64748B" />

          {/* Filing Cabinet (Storage) */}
          <View style={styles.compareBox}>
            <View style={[styles.compareIconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Ionicons name="file-tray-full-outline" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.compareTitle}>Storage (Drive)</Text>
            <Text style={styles.compareSub}>Your Filing Cabinet</Text>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>Permanent Photos & Files</Text>
            </View>
          </View>
        </View>
        <Text style={styles.animCaption}>
          RAM holds what you use right now • Storage keeps your files permanently
        </Text>
      </View>
    );
  }

  // 5. Compass & Magnetic Flux Animation
  if (type === 'compass_rose') {
    const spinInterpolate = spinAnim.interpolate({
      inputRange: [-1, 1],
      outputRange: ['-35deg', '35deg'],
    });

    return (
      <View style={styles.animCanvas}>
        <View style={styles.sceneContainer}>
          <View style={styles.compassMiniDial}>
            <Animated.View
              style={[
                styles.compassMiniNeedleWrap,
                { transform: [{ rotate: spinInterpolate }] },
              ]}
            >
              <View style={styles.miniNeedleN} />
              <View style={styles.miniNeedleS} />
            </Animated.View>
          </View>
        </View>
        <Text style={styles.animCaption}>
          Magnetic Flux Sensor detects Earth’s invisible geomagnetic field
        </Text>
      </View>
    );
  }

  // Default Touch Grid
  return (
    <View style={styles.animCanvas}>
      <View style={styles.touchTileRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={`tt_${i}`}
            style={[
              styles.touchMiniTile,
              { backgroundColor: i < 4 ? '#10B981' : 'rgba(255,255,255,0.06)' },
            ]}
          >
            {i < 4 && <Ionicons name="checkmark" size={13} color="#070B14" />}
          </View>
        ))}
      </View>
      <Text style={styles.animCaption}>
        Capacitive Digitizer verifies touch response across all screen tiles
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  animCanvas: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    marginBottom: 16,
  },
  sceneContainer: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  speakerBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  speakerConeCenter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wavesWrapper: {
    width: 50,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  soundWaveArc: {
    position: 'absolute',
    width: 36,
    height: 54,
    borderRightWidth: 3,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  animCaption: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  batteryShell: {
    width: 44,
    height: 74,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#94A3B8',
    position: 'relative',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  batteryPin: {
    position: 'absolute',
    top: -5,
    alignSelf: 'center',
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
  },
  batteryLiquidFill: {
    width: '100%',
    borderRadius: 4,
  },
  batteryThresholdLine: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    height: 1.5,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  safeZoneBadge: {
    position: 'absolute',
    top: -18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 3,
  },
  safeZoneText: {
    color: '#10B981',
    fontSize: 8.5,
    fontWeight: '800',
  },
  pixelMatrixBox: {
    gap: 5,
    padding: 8,
  },
  pixelRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pixelSubDot: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  deadPixelDot: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 8,
  },
  compareBox: {
    alignItems: 'center',
    padding: 8,
  },
  compareIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  compareTitle: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '800',
  },
  compareSub: {
    color: '#94A3B8',
    fontSize: 10.5,
    marginTop: 1,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  tagText: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '600',
  },
  compassMiniDial: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#00F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.05)',
  },
  compassMiniNeedleWrap: {
    width: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniNeedleN: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EF4444',
  },
  miniNeedleS: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#94A3B8',
  },
  touchTileRow: {
    flexDirection: 'row',
    gap: 8,
  },
  touchMiniTile: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

