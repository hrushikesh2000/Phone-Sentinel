import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SectionCard } from '../components/SectionCard';
import { InfoRow } from '../components/InfoRow';
import { StatBadge } from '../components/StatBadge';
import { HapticVisualFeedback } from '../components/HapticVisualFeedback';
import { SensorMotionCard } from '../components/SensorMotionCard';
import { ScreenDeadPixelModal } from '../components/ScreenDeadPixelModal';
import { HealthCheckCard } from '../components/HealthCheckCard';
import { COLORS } from '../styles/theme';

export function LabScreen({ hardware, batteryData, networkInfo }) {
  const [deadPixelModalVisible, setDeadPixelModalVisible] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);

  // Screen Geometry
  const screen = Dimensions.get('screen');
  const pixelRatio = PixelRatio.get();
  const fontScale = PixelRatio.getFontScale();

  const runHapticTest = async (type) => {
    try {
      if (type === 'light') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveFeedback({
          name: 'Light Tap Feedback',
          duration: '25ms',
          description: 'Quick micro-pulse for subtle tactile feedback.',
        });
      } else if (type === 'medium') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setActiveFeedback({
          name: 'Medium Tactile Pulse',
          duration: '45ms',
          description: 'Balanced tactile bump for switches and toggles.',
        });
      } else if (type === 'heavy') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setActiveFeedback({
          name: 'Heavy Impact Impulse',
          duration: '75ms',
          description: 'Deep actuator stroke for warnings and critical changes.',
        });
      } else if (type === 'notification') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setActiveFeedback({
          name: 'Success Pattern Chime',
          duration: '60ms',
          description: 'Multi-pulse positive acknowledgement sequence.',
        });
      } else if (type === 'vibration') {
        Vibration.vibrate([0, 120, 80, 120]);
        setActiveFeedback({
          name: 'Dual-Pulse Motor Buzz',
          duration: '320ms',
          description: 'Dual rhythmic actuator burst from the physical vibration motor.',
        });
      }
    } catch (e) {
      Vibration.vibrate(120);
      setActiveFeedback({
        name: 'Standard Vibration Buzz',
        duration: '120ms',
        description: 'Native fallback vibration pulse.',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Haptic & Vibration Motor Lab with Light Visual Feedback */}
      <SectionCard
        icon="radio-outline"
        iconColor={COLORS.accent}
        title="Haptic & Vibration Motor"
        subtitle="Tactile feedback profiles & actuator monitor"
        accentColor={COLORS.accent}
        badge={<StatBadge label="ACTUATOR" variant="success" size="small" />}
      >
        {/* Light Visual Actuator Notification / Monitor */}
        <HapticVisualFeedback feedbackEvent={activeFeedback} />

        <Text style={styles.explainerText}>
          Tap any profile to trigger physical vibration. The monitor above provides live visual confirmation of actuator firing.
        </Text>

        <View style={styles.hapticGrid}>
          <TouchableOpacity
            style={styles.hapticBtn}
            onPress={() => runHapticTest('light')}
            activeOpacity={0.7}
          >
            <Ionicons name="finger-print-outline" size={18} color={COLORS.primary} />
            <Text style={styles.hapticBtnLabel}>Light Tap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hapticBtn}
            onPress={() => runHapticTest('medium')}
            activeOpacity={0.7}
          >
            <Ionicons name="hand-left-outline" size={18} color={COLORS.secondary} />
            <Text style={styles.hapticBtnLabel}>Medium Pulse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hapticBtn}
            onPress={() => runHapticTest('heavy')}
            activeOpacity={0.7}
          >
            <Ionicons name="hammer-outline" size={18} color={COLORS.warning} />
            <Text style={styles.hapticBtnLabel}>Heavy Impact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hapticBtn}
            onPress={() => runHapticTest('notification')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={18} color={COLORS.success} />
            <Text style={styles.hapticBtnLabel}>Success Chime</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.hapticBtn, styles.hapticFullBtn]}
            onPress={() => runHapticTest('vibration')}
            activeOpacity={0.7}
          >
            <Ionicons name="pulse-outline" size={18} color={COLORS.primary} />
            <Text style={styles.hapticBtnLabel}>Dual-Pulse Motor Buzz (Physical Rotor)</Text>
          </TouchableOpacity>
        </View>
      </SectionCard>

      {/* 2. Real-Time Accelerometer & Bubble Level Sensor */}
      <SensorMotionCard />

      {/* 3. Screen & OLED Uniformity Test */}
      <SectionCard
        icon="scan-outline"
        iconColor={COLORS.primary}
        title="Display & Screen Test"
        subtitle="RGBW pixel inspection & OLED uniformity"
        accentColor={COLORS.primary}
        badge={<StatBadge label="INTERACTIVE" variant="cyan" size="small" />}
      >
        <Text style={styles.explainerText}>
          Inspect your screen for dead pixels, sub-pixel defects, or OLED burn-in with an interactive full-screen color cycle.
        </Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setDeadPixelModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="color-palette-outline" size={20} color="#070B14" style={styles.btnIcon} />
          <Text style={styles.actionBtnText}>Launch Dead Pixel Test</Text>
        </TouchableOpacity>
      </SectionCard>

      {/* 4. Display Geometry & DPI Metrics */}
      <SectionCard
        icon="phone-portrait-outline"
        iconColor={COLORS.secondary}
        title="Display Geometry & DPI"
        subtitle="Resolution & density telemetry"
        accentColor={COLORS.secondary}
      >
        <InfoRow
          label="Physical Resolution"
          value={`${Math.round(screen.width * pixelRatio)} × ${Math.round(screen.height * pixelRatio)} px`}
          highlight
          subvalue={`Screen: ${Math.round(screen.width)} × ${Math.round(screen.height)} dp`}
        />

        <InfoRow
          label="Pixel Density"
          value={`${pixelRatio.toFixed(2)}x (${Math.round(pixelRatio * 160)} dpi)`}
          subvalue="Density-independent pixel scaling"
        />

        <InfoRow
          label="Aspect Ratio"
          value={`${(screen.height / screen.width).toFixed(2)} : 1`}
          isLast
        />
      </SectionCard>

      {/* 5. System Health Audit Section */}
      <HealthCheckCard
        hardware={hardware}
        batteryData={batteryData}
        networkInfo={networkInfo}
      />

      {/* Full-Screen Dead Pixel Modal */}
      <ScreenDeadPixelModal
        visible={deadPixelModalVisible}
        onClose={() => setDeadPixelModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  explainerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  btnIcon: {
    marginRight: 8,
  },
  actionBtnText: {
    color: '#070B14',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  hapticGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hapticBtn: {
    flex: 1,
    minWidth: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  hapticFullBtn: {
    minWidth: '100%',
  },
  hapticBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
});

