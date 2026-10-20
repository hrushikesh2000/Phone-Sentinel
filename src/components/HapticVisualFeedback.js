import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export function HapticVisualFeedback({ feedbackEvent }) {
  const { theme, isDark } = useTheme();

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
      <View
        style={[
          styles.idleContainer,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <Ionicons name="radio-outline" size={16} color={theme.textMuted} />
        <Text style={[styles.idleText, { color: theme.textMuted }]}>
          Tap any vibration profile below to feel and see actuator response
        </Text>
      </View>
    );
  }

  const rippleScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.4],
  });

  return (
    <View
      style={[
        styles.activeContainer,
        {
          backgroundColor: theme.primaryLight,
          borderColor: `${theme.primary}44`,
        },
      ]}
    >
      {/* Expanding Ripple Ring */}
      <View style={styles.rippleOrigin}>
        <Animated.View
          style={[
            styles.rippleRing,
            {
              borderColor: theme.primary,
              backgroundColor: theme.primaryLight,
              transform: [{ scale: rippleScale }],
              opacity: pulseAnim,
            },
          ]}
        />
        <View style={[styles.centerIcon, { backgroundColor: theme.card }]}>
          <Ionicons name="hardware-chip" size={18} color={theme.primary} />
        </View>
      </View>

      {/* Actuator Status & Waveform */}
      <View style={styles.feedbackInfo}>
        <View style={styles.titleRow}>
          <Text style={[styles.activeLabel, { color: theme.primary }]}>VIBRATION CONFIRMED</Text>
          <View style={[styles.msBadge, { backgroundColor: `${theme.primary}22` }]}>
            <Text style={[styles.msText, { color: theme.primary }]}>{feedbackEvent.duration || '40ms'}</Text>
          </View>
        </View>

        <Text style={[styles.patternName, { color: theme.textPrimary }]}>{feedbackEvent.name}</Text>
        <Text style={[styles.descText, { color: theme.textSecondary }]}>{feedbackEvent.description}</Text>

        {/* Live Actuator Waveform Bars */}
        <View style={styles.waveformContainer}>
          <Animated.View
            style={[
              styles.waveBar,
              {
                backgroundColor: theme.secondary,
                height: barAnim1.interpolate({ inputRange: [0, 1], outputRange: [4, 18] }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.waveBar,
              {
                backgroundColor: theme.primary,
                height: barAnim2.interpolate({ inputRange: [0, 1], outputRange: [6, 26] }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.waveBar,
              {
                backgroundColor: theme.secondary,
                height: barAnim3.interpolate({ inputRange: [0, 1], outputRange: [5, 22] }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.waveBar,
              {
                backgroundColor: theme.primary,
                height: barAnim4.interpolate({ inputRange: [0, 1], outputRange: [4, 16] }),
              },
            ]}
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
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  idleText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 14,
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
  },
  centerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    letterSpacing: 0.8,
  },
  msBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  msText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  patternName: {
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  descText: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 15,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 8,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
});
