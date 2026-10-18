import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';

export function HapticVisualFeedback({ feedbackEvent }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const barAnim1 = useRef(new Animated.Value(0.2)).current;
  const barAnim2 = useRef(new Animated.Value(0.4)).current;
  const barAnim3 = useRef(new Animated.Value(0.3)).current;
  const barAnim4 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    if (feedbackEvent) {
      pulseAnim.setValue(0);

      // Sonic ripple & wave animation
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(barAnim1, { toValue: 1, duration: 80, useNativeDriver: false }),
          Animated.timing(barAnim1, { toValue: 0.2, duration: 250, useNativeDriver: false }),
        ]),
        Animated.sequence([
          Animated.timing(barAnim2, { toValue: 0.9, duration: 110, useNativeDriver: false }),
          Animated.timing(barAnim2, { toValue: 0.3, duration: 250, useNativeDriver: false }),
        ]),
        Animated.sequence([
          Animated.timing(barAnim3, { toValue: 1, duration: 130, useNativeDriver: false }),
          Animated.timing(barAnim3, { toValue: 0.2, duration: 250, useNativeDriver: false }),
        ]),
        Animated.sequence([
          Animated.timing(barAnim4, { toValue: 0.8, duration: 100, useNativeDriver: false }),
          Animated.timing(barAnim4, { toValue: 0.2, duration: 250, useNativeDriver: false }),
        ]),
      ]).start();
    }
  }, [feedbackEvent, pulseAnim, barAnim1, barAnim2, barAnim3, barAnim4]);

  if (!feedbackEvent) {
    return (
      <View style={styles.idleContainer}>
        <Ionicons name="radio-outline" size={16} color={COLORS.textMuted} />
        <Text style={styles.idleText}>Tap any actuator test below to inspect physical feedback</Text>
      </View>
    );
  }

  const rippleScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.4],
  });

  return (
    <View style={styles.activeContainer}>
      {/* Expanding Ripple Ring */}
      <View style={styles.rippleOrigin}>
        <Animated.View
          style={[
            styles.rippleRing,
            {
              transform: [{ scale: rippleScale }],
              opacity: pulseAnim,
            },
          ]}
        />
        <View style={styles.centerIcon}>
          <Ionicons name="hardware-chip" size={18} color="#00F2FE" />
        </View>
      </View>

      {/* Actuator Status & Waveform */}
      <View style={styles.feedbackInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.activeLabel}>MOTOR ACTUATOR FIRED</Text>
          <View style={styles.msBadge}>
            <Text style={styles.msText}>{feedbackEvent.duration || '40ms'}</Text>
          </View>
        </View>

        <Text style={styles.patternName}>{feedbackEvent.name}</Text>
        <Text style={styles.descText}>{feedbackEvent.description}</Text>

        {/* Live Actuator Waveform Bars */}
        <View style={styles.waveformContainer}>
          <Animated.View
            style={[styles.waveBar, { height: barAnim1.interpolate({ inputRange: [0, 1], outputRange: [4, 18] }) }]}
          />
          <Animated.View
            style={[styles.waveBar, styles.waveBarAccent, { height: barAnim2.interpolate({ inputRange: [0, 1], outputRange: [6, 26] }) }]}
          />
          <Animated.View
            style={[styles.waveBar, { height: barAnim3.interpolate({ inputRange: [0, 1], outputRange: [5, 22] }) }]}
          />
          <Animated.View
            style={[styles.waveBar, styles.waveBarAccent, { height: barAnim4.interpolate({ inputRange: [0, 1], outputRange: [4, 16] }) }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  idleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  idleText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    padding: 14,
    marginBottom: 14,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  rippleOrigin: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rippleRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#00F2FE',
    backgroundColor: 'rgba(0, 242, 254, 0.2)',
  },
  centerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  activeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00F2FE',
    letterSpacing: 0.8,
  },
  msBadge: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  msText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00F2FE',
  },
  patternName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  descText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 8,
  },
  waveBar: {
    width: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },
  waveBarAccent: {
    backgroundColor: '#00F2FE',
  },
});

