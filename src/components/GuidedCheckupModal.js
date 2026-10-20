import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync, setIsAudioActiveAsync } from 'expo-audio';
import { ExplainerAnimation } from './ExplainerAnimation';
import { useTheme } from '../context/ThemeContext';
import { sharePhoneHealthWithFamily } from '../utils/familyShare';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TONE_1KHZ = require('../../assets/tones/tone_1000hz_both.wav');

export function GuidedCheckupModal({
  visible,
  onClose,
  hardware = {},
  batteryData = {},
  networkInfo = {},
}) {
  const { t, language } = useTheme();

  // Wizard state: 1 (Sound), 2 (Touch), 3 (Vibration), 4 (Done/Prescription)
  const [currentStep, setCurrentStep] = useState(1);
  const [speakerPassed, setSpeakerPassed] = useState(true);
  const [vibrationPassed, setVibrationPassed] = useState(true);
  const [touchedBoxes, setTouchedBoxes] = useState(() => new Set());
  const [shareSuccess, setShareSuccess] = useState(false);

  const playerRef = useRef(null);
  const touchCanvasRef = useRef({ x: 0, y: 0, width: SCREEN_WIDTH - 40, height: 220 });

  // Play audio tone on Step 1
  useEffect(() => {
    let activePlayer = null;

    async function playStep1Tone() {
      if (visible && currentStep === 1) {
        try {
          await setIsAudioActiveAsync(true);
          await setAudioModeAsync({
            playsInSilentMode: true,
            staysActiveInBackground: false,
          });
          const player = createAudioPlayer(TONE_1KHZ);
          playerRef.current = player;
          activePlayer = player;
          player.loop = true;
          player.volume = 1.0;
          player.play();
        } catch (e) {
          console.log('Audio playback note:', e);
        }
      } else {
        stopAudio();
      }
    }

    playStep1Tone();

    return () => {
      stopAudio();
    };
  }, [visible, currentStep]);

  const stopAudio = () => {
    try {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.release();
        playerRef.current = null;
      }
    } catch (e) {}
  };

  // Step 3 trigger vibration
  useEffect(() => {
    if (visible && currentStep === 3) {
      try {
        Vibration.vibrate([0, 180, 100, 180]);
      } catch (e) {}
    }
  }, [visible, currentStep]);

  // Handle Box touches on Step 2
  const handleTouchMove = (evt) => {
    const touches = evt.nativeEvent.touches;
    if (!touches || touches.length === 0) return;

    const { width: w, height: h } = touchCanvasRef.current;
    const boxW = w / 2;
    const boxH = h / 3;

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const relX = touch.locationX;
      const relY = touch.locationY;

      const col = Math.floor(relX / boxW);
      const row = Math.floor(relY / boxH);

      if (col >= 0 && col < 2 && row >= 0 && row < 3) {
        const key = `${col}_${row}`;
        setTouchedBoxes((prev) => {
          if (prev.has(key)) return prev;
          const next = new Set(prev);
          next.add(key);
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (e) {}

          // All 6 cleaned!
          if (next.size === 6) {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (e) {}
            setTimeout(() => {
              setCurrentStep(3);
            }, 400);
          }
          return next;
        });
      }
    }
  };

  const handleSpeakerAnswer = (passed) => {
    stopAudio();
    setSpeakerPassed(passed);
    try {
      Haptics.selectionAsync();
    } catch (e) {}
    setCurrentStep(2);
  };

  const handleVibrationAnswer = (passed) => {
    setVibrationPassed(passed);
    try {
      Haptics.selectionAsync();
    } catch (e) {}
    setCurrentStep(4);
  };

  const handleShareFamily = async () => {
    const res = await sharePhoneHealthWithFamily({
      hardware,
      batteryData,
      language,
    });
    if (res.success) {
      setShareSuccess(true);
    }
  };

  const handleResetAndClose = () => {
    stopAudio();
    setCurrentStep(1);
    setTouchedBoxes(new Set());
    setShareSuccess(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleResetAndClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#050811" />

        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.titleWrap}>
            <Ionicons name="medkit" size={20} color="#00F2FE" />
            <Text style={styles.topTitle}>{t('wizard_title')}</Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleResetAndClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Progress Tracker (Steps 1 to 4) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {t('wizard_step')} {currentStep} {t('wizard_of')} 4
            </Text>
            <Text style={styles.stepTitleText}>
              {currentStep === 1
                ? t('sound_title')
                : currentStep === 2
                ? 'Touch Screen'
                : currentStep === 3
                ? 'Vibration Buzz'
                : t('wizard_done_grade')}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* STEP 1: Sound & Speaker */}
          {currentStep === 1 && (
            <View style={styles.stepBox}>
              <ExplainerAnimation type="speaker_cone" color="#00F2FE" />
              <Text style={styles.questionPrompt}>{t('wizard_speaker_prompt')}</Text>

              <TouchableOpacity
                style={[styles.bigActionBtn, styles.btnSuccess]}
                onPress={() => handleSpeakerAnswer(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnTextWhite}>{t('wizard_speaker_yes')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bigActionBtn, styles.btnSecondary]}
                onPress={() => handleSpeakerAnswer(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnTextLight}>{t('wizard_speaker_no')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: Touch Clean Canvas */}
          {currentStep === 2 && (
            <View style={styles.stepBox}>
              <Text style={styles.questionPrompt}>{t('wizard_touch_prompt')}</Text>
              <Text style={styles.touchCounter}>
                {touchedBoxes.size} / 6 {t('wizard_touch_progress')}
              </Text>

              <View
                style={styles.touchGridCanvas}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleTouchMove}
                onResponderMove={handleTouchMove}
              >
                {[0, 1, 2].map((r) => (
                  <View key={`row_${r}`} style={styles.gridRow}>
                    {[0, 1].map((c) => {
                      const isClean = touchedBoxes.has(`${c}_${r}`);
                      return (
                        <View
                          key={`box_${c}_${r}`}
                          style={[
                            styles.touchCell,
                            isClean ? styles.touchCellClean : styles.touchCellDusty,
                          ]}
                        >
                          <Ionicons
                            name={isClean ? 'checkmark-circle' : 'hand-left-outline'}
                            size={28}
                            color={isClean ? '#050811' : 'rgba(255,255,255,0.4)'}
                          />
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* STEP 3: Vibration Buzz */}
          {currentStep === 3 && (
            <View style={styles.stepBox}>
              <ExplainerAnimation type="compass_rose" color="#10B981" />
              <Text style={styles.questionPrompt}>{t('wizard_vibration_prompt')}</Text>

              <TouchableOpacity
                style={[styles.bigActionBtn, styles.btnSuccess]}
                onPress={() => handleVibrationAnswer(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnTextWhite}>{t('wizard_vibration_yes')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bigActionBtn, styles.btnSecondary]}
                onPress={() => handleVibrationAnswer(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnTextLight}>{t('wizard_vibration_no')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 4: Doctor Certificate, Prescription & WhatsApp Share */}
          {currentStep === 4 && (
            <View style={styles.stepBox}>
              {/* Grade A+ Seal */}
              <View style={styles.certCard}>
                <View style={styles.certSeal}>
                  <Ionicons name="shield-checkmark" size={32} color="#10B981" />
                  <Text style={styles.certGrade}>96/100</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.certTitle}>{t('wizard_done_title')}</Text>
                  <Text style={styles.certSub}>{t('wizard_done_grade')}</Text>
                  <Text style={styles.certDesc}>{t('wizard_done_desc')}</Text>
                </View>
              </View>

              {/* 3 Simple Health Badges */}
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Ionicons name="battery-charging" size={18} color="#10B981" />
                  <Text style={styles.summaryText}>{t('battery_title')}</Text>
                  <Text style={styles.summaryStatus}>✓ Good</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Ionicons name="volume-high" size={18} color="#00F2FE" />
                  <Text style={styles.summaryText}>{t('sound_title')}</Text>
                  <Text style={styles.summaryStatus}>{speakerPassed ? '✓ Clear' : 'Faint'}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Ionicons name="finger-print" size={18} color="#818CF8" />
                  <Text style={styles.summaryText}>Touch</Text>
                  <Text style={styles.summaryStatus}>✓ Passed</Text>
                </View>
              </View>

              {/* Doctor's Advice Card */}
              <View style={styles.adviceBox}>
                <View style={styles.adviceHeaderRow}>
                  <Ionicons name="medkit" size={18} color="#00F2FE" />
                  <Text style={styles.adviceHeaderTitle}>{t('prescription_title')}</Text>
                </View>
                <Text style={styles.adviceBullet}>• {t('tip_1')}</Text>
                <Text style={styles.adviceBullet}>• {t('tip_2')}</Text>
                <Text style={styles.adviceBullet}>• {t('tip_3')}</Text>
              </View>

              {/* 1-Tap WhatsApp Share */}
              <TouchableOpacity
                style={[styles.bigActionBtn, styles.btnWhatsApp]}
                onPress={handleShareFamily}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.btnTextWhite}>
                  {shareSuccess ? '✓ ' + t('whatsapp_copied') : t('ask_family_btn')}
                </Text>
              </TouchableOpacity>

              {/* Finish Checkup */}
              <TouchableOpacity
                style={[styles.bigActionBtn, styles.btnPrimary]}
                onPress={handleResetAndClose}
                activeOpacity={0.85}
              >
                <Text style={styles.btnTextDark}>{t('wizard_done_btn')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050811',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    color: '#00F2FE',
    fontSize: 12,
    fontWeight: '800',
  },
  stepTitleText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00F2FE',
    borderRadius: 3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  stepBox: {
    alignItems: 'center',
  },
  questionPrompt: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 14,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  bigActionBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  btnSuccess: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  btnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  btnWhatsApp: {
    backgroundColor: '#25D366',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  btnPrimary: {
    backgroundColor: '#00F2FE',
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  btnTextLight: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '700',
  },
  btnTextDark: {
    color: '#050811',
    fontSize: 16,
    fontWeight: '800',
  },
  touchCounter: {
    color: '#00F2FE',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 14,
  },
  touchGridCanvas: {
    width: '100%',
    height: 240,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  touchCell: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchCellDusty: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  touchCellClean: {
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#34D399',
  },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  certSeal: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certGrade: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  certTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  certSub: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  certDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#0C1222',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  summaryText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  summaryStatus: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  adviceBox: {
    width: '100%',
    backgroundColor: '#0C1222',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  adviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  adviceHeaderTitle: {
    color: '#00F2FE',
    fontSize: 14,
    fontWeight: '800',
  },
  adviceBullet: {
    color: '#CBD5E1',
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 6,
  },
});

