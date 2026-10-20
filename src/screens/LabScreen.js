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
import { EnvironmentSensorsCard } from '../components/EnvironmentSensorsCard';
import { ScreenDeadPixelModal } from '../components/ScreenDeadPixelModal';
import { TouchGridModal } from '../components/TouchGridModal';
import { AudioDiagnosticsModal } from '../components/AudioDiagnosticsModal';
import { HardwarePassportModal } from '../components/HardwarePassportModal';
import { HealthCheckCard } from '../components/HealthCheckCard';
import { ExplainerModal } from '../components/ExplainerModal';
import { useTheme } from '../context/ThemeContext';

export function LabScreen({ hardware, batteryData, networkInfo }) {
  const { theme, isDark } = useTheme();

  const [deadPixelModalVisible, setDeadPixelModalVisible] = useState(false);
  const [touchModalVisible, setTouchModalVisible] = useState(false);
  const [audioModalVisible, setAudioModalVisible] = useState(false);
  const [passportModalVisible, setPassportModalVisible] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [explainerTopic, setExplainerTopic] = useState(null);

  // Screen Geometry
  const screen = Dimensions.get('screen');
  const pixelRatio = PixelRatio.get();

  const runHapticTest = async (type) => {
    try {
      if (type === 'light') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveFeedback({
          name: 'Gentle Tap',
          duration: '25ms',
          description: 'Subtle micro-pulse for discrete UI touches and switches.',
        });
      } else if (type === 'medium') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setActiveFeedback({
          name: 'Tactile Pulse',
          duration: '45ms',
          description: 'Balanced physical bump for confirmations and button taps.',
        });
      } else if (type === 'heavy') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setActiveFeedback({
          name: 'Impact Impulse',
          duration: '75ms',
          description: 'Deep actuator stroke for critical alerts and warnings.',
        });
      } else if (type === 'notification') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setActiveFeedback({
          name: 'Chime Pattern',
          duration: '60ms',
          description: 'Rhythmic positive acknowledgement tactile sequence.',
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
      {/* 1. Hardware Inspection Passport Card */}
      <SectionCard
        icon="shield-checkmark"
        iconColor="#F59E0B"
        title="Hardware Inspection Passport"
        subtitle="Used-phone audit certificate & diagnostic ledger"
        badge={<StatBadge label="Grade A+" variant="warning" size="small" />}
        onHelpPress={() => setExplainerTopic('hardware_passport')}
      >
        <Text style={[styles.explainerText, { color: theme.textSecondary }]}>
          Generate a tamper-evident digital certificate with component test results, hardware serial hashes, and verification scores to share with buyers or sellers.
        </Text>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: '#F59E0B',
            },
          ]}
          onPress={() => setPassportModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={19} color="#070B14" style={styles.btnIcon} />
          <Text style={[styles.actionBtnText, { color: '#070B14' }]}>View & Export Hardware Passport</Text>
        </TouchableOpacity>
      </SectionCard>

      {/* 2. Haptic & Vibration Motor Lab */}
      <SectionCard
        icon="radio-outline"
        iconColor={theme.accent}
        title="Vibration & Haptics"
        subtitle="Test actuator motor profiles with visual feedback"
        badge={<StatBadge label="Actuator" variant="success" size="small" />}
      >
        <HapticVisualFeedback feedbackEvent={activeFeedback} />

        <Text style={[styles.explainerText, { color: theme.textSecondary }]}>
          Tap any pattern to test the physical motor. The visual monitor confirms actuator dispatch in real-time.
        </Text>

        <View style={styles.hapticGrid}>
          <TouchableOpacity
            style={[
              styles.hapticBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => runHapticTest('light')}
            activeOpacity={0.7}
          >
            <Ionicons name="finger-print-outline" size={18} color={theme.primary} />
            <Text style={[styles.hapticBtnLabel, { color: theme.textPrimary }]}>Gentle Tap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.hapticBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => runHapticTest('medium')}
            activeOpacity={0.7}
          >
            <Ionicons name="hand-left-outline" size={18} color={theme.secondary} />
            <Text style={[styles.hapticBtnLabel, { color: theme.textPrimary }]}>Tactile Pulse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.hapticBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => runHapticTest('heavy')}
            activeOpacity={0.7}
          >
            <Ionicons name="hammer-outline" size={18} color={theme.warning} />
            <Text style={[styles.hapticBtnLabel, { color: theme.textPrimary }]}>Impact Stroke</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.hapticBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => runHapticTest('notification')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={18} color={theme.success} />
            <Text style={[styles.hapticBtnLabel, { color: theme.textPrimary }]}>Chime Pulse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.hapticBtn,
              styles.hapticFullBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => runHapticTest('vibration')}
            activeOpacity={0.7}
          >
            <Ionicons name="pulse-outline" size={18} color={theme.primary} />
            <Text style={[styles.hapticBtnLabel, { color: theme.textPrimary }]}>
              Dual-Pulse Motor Buzz (Rotor Engine)
            </Text>
          </TouchableOpacity>
        </View>
      </SectionCard>

      {/* 3. Audio & Acoustic Diagnostics Lab */}
      <SectionCard
        icon="volume-high-outline"
        iconColor="#00F2FE"
        title="Acoustic & Audio Lab"
        subtitle="Frequency sweeps (250Hz - 8kHz) & stereo balance"
        badge={<StatBadge label="Audio DSP" variant="primary" size="small" />}
      >
        <Text style={[styles.explainerText, { color: theme.textSecondary }]}>
          Test speaker drivers with calibrated pure sine wave audio tones to detect voice coil distortion, buzzing, or stereo channel imbalances.
        </Text>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: '#00F2FE',
            },
          ]}
          onPress={() => setAudioModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="play-circle-outline" size={20} color="#070B14" style={styles.btnIcon} />
          <Text style={[styles.actionBtnText, { color: '#070B14' }]}>Launch Audio Diagnostics</Text>
        </TouchableOpacity>
      </SectionCard>

      {/* 4. Real-Time Accelerometer & Bubble Level Sensor */}
      <SensorMotionCard />

      {/* 5. Geomagnetic Compass & Photometer Lux Sensor */}
      <EnvironmentSensorsCard />

      {/* 6. Screen & Touch Digitizer Tests */}
      <SectionCard
        icon="scan-outline"
        iconColor={theme.primary}
        title="Display & Touch Lab"
        subtitle="Dead pixels, OLED burn-in & multi-touch digitizer"
        badge={<StatBadge label="Interactive" variant="primary" size="small" />}
        onHelpPress={() => setExplainerTopic('touch_digitizer')}
      >
        <Text style={[styles.explainerText, { color: theme.textSecondary }]}>
          Test your display panel for dead pixels and screen uniformity, or verify capacitive touch responsiveness across all grid zones.
        </Text>

        <View style={styles.buttonStack}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={() => setDeadPixelModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="color-palette-outline" size={19} color="#FFFFFF" style={styles.btnIcon} />
            <Text style={styles.actionBtnText}>Launch Dead Pixel Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: isDark ? 'rgba(0, 242, 254, 0.15)' : '#E0F2FE',
                borderWidth: 1,
                borderColor: '#00F2FE',
              },
            ]}
            onPress={() => setTouchModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="finger-print-outline" size={19} color="#00F2FE" style={styles.btnIcon} />
            <Text style={[styles.actionBtnText, { color: '#00F2FE' }]}>
              Launch Touch Digitizer & Multi-Touch
            </Text>
          </TouchableOpacity>
        </View>
      </SectionCard>

      {/* 7. Display Geometry & DPI Metrics */}
      <SectionCard
        icon="phone-portrait-outline"
        iconColor={theme.secondary}
        title="Display Metrics"
        subtitle="Physical resolution & pixel density"
      >
        <InfoRow
          label="Physical Resolution"
          value={`${Math.round(screen.width * pixelRatio)} × ${Math.round(screen.height * pixelRatio)} px`}
          highlight
          subvalue={`Screen Canvas: ${Math.round(screen.width)} × ${Math.round(screen.height)} dp`}
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

      {/* 8. System Health Audit Section */}
      <HealthCheckCard
        hardware={hardware}
        batteryData={batteryData}
        networkInfo={networkInfo}
      />

      {/* Modals */}
      <ScreenDeadPixelModal
        visible={deadPixelModalVisible}
        onClose={() => setDeadPixelModalVisible(false)}
      />

      <TouchGridModal
        visible={touchModalVisible}
        onClose={() => setTouchModalVisible(false)}
      />

      <AudioDiagnosticsModal
        visible={audioModalVisible}
        onClose={() => setAudioModalVisible(false)}
      />

      <HardwarePassportModal
        visible={passportModalVisible}
        onClose={() => setPassportModalVisible(false)}
        hardware={hardware}
        batteryData={batteryData}
        networkInfo={networkInfo}
      />

      {/* Plain-English Accessible Explainer Modal */}
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
    paddingBottom: 24,
  },
  explainerText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  buttonStack: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  btnIcon: {
    marginRight: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  hapticGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hapticBtn: {
    flex: 1,
    minWidth: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  hapticFullBtn: {
    minWidth: '100%',
  },
  hapticBtnLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    marginLeft: 8,
  },
});
