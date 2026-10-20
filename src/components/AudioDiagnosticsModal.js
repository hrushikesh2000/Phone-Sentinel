import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  createAudioPlayer,
  setAudioModeAsync,
  setIsAudioActiveAsync,
} from 'expo-audio';

// Statically bundled 16-bit PCM WAV tone assets
const TONE_ASSETS = {
  '250_both': require('../../assets/tones/tone_250hz_both.wav'),
  '1000_both': require('../../assets/tones/tone_1000hz_both.wav'),
  '4000_both': require('../../assets/tones/tone_4000hz_both.wav'),
  '8000_both': require('../../assets/tones/tone_8000hz_both.wav'),
  '1000_left': require('../../assets/tones/tone_1000hz_left.wav'),
  '1000_right': require('../../assets/tones/tone_1000hz_right.wav'),
};

const FREQUENCIES = [
  {
    freq: 250,
    name: '250 Hz',
    band: 'Deep Bass Resonance',
    desc: 'Tests low-frequency diaphragm excursion & chassis resonance.',
    icon: 'radio-outline',
  },
  {
    freq: 1000,
    name: '1 kHz',
    band: 'Mid Standard Reference',
    desc: 'Telephony & dialogue reference standard for speech clarity.',
    icon: 'mic-outline',
  },
  {
    freq: 4000,
    name: '4 kHz',
    band: 'High Presence Tone',
    desc: 'Tests upper vocal harmonics, transient response & definition.',
    icon: 'musical-notes-outline',
  },
  {
    freq: 8000,
    name: '8 kHz',
    band: 'Treble Sibilance Limit',
    desc: 'High-frequency limit test for micro-tweeters & ear speakers.',
    icon: 'pulse-outline',
  },
];

const CHANNELS = [
  { id: 'left', label: 'Top / Earpiece Driver', icon: 'volume-low-outline' },
  { id: 'both', label: 'Stereo Balanced Pair', icon: 'volume-high-outline' },
  { id: 'right', label: 'Bottom Loudspeaker', icon: 'volume-low-outline' },
];

export function AudioDiagnosticsModal({ visible, onClose }) {
  const [selectedFreq, setSelectedFreq] = useState(1000);
  const [selectedChannel, setSelectedChannel] = useState('both');
  const [isPlaying, setIsPlaying] = useState(false);
  const [assessment, setAssessment] = useState(null); // 'pass' | 'rattle' | 'silent'
  const [playbackError, setPlaybackError] = useState(null);

  const playerRef = useRef(null);

  // Animated visualizer bars
  const barAnims = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0.2))
  ).current;

  // Pulse animation loop when playing
  useEffect(() => {
    let animLoop = null;

    if (isPlaying) {
      const createBarAnim = (anim) => {
        return Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.35 + Math.random() * 0.65,
            duration: 110 + Math.random() * 70,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.15 + Math.random() * 0.25,
            duration: 110 + Math.random() * 70,
            useNativeDriver: true,
          }),
        ]);
      };

      const runAll = () => {
        const animations = barAnims.map((anim) => createBarAnim(anim));
        animLoop = Animated.parallel(animations);
        animLoop.start(({ finished }) => {
          if (finished && isPlaying) {
            runAll();
          }
        });
      };

      runAll();
    } else {
      barAnims.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 0.15,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    }

    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isPlaying, barAnims]);

  // Stop playback and release native player
  const stopPlayback = () => {
    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.release();
      } catch (e) {
        console.warn('Audio release error:', e);
      }
      playerRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!visible) {
      stopPlayback();
    }
  }, [visible]);

  const togglePlayback = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}

    if (isPlaying) {
      stopPlayback();
      return;
    }

    setPlaybackError(null);

    try {
      // 1. Configure audio mode to ensure audio routes through loudspeakers and works in silent mode
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'doNotMix',
          shouldRouteThroughEarpiece: selectedChannel === 'left',
        });
        await setIsAudioActiveAsync(true);
      } catch (modeErr) {
        console.warn('AudioMode warning:', modeErr);
      }

      // 2. Select appropriate bundled audio asset
      const assetKey =
        selectedChannel !== 'both'
          ? `1000_${selectedChannel}`
          : `${selectedFreq}_both`;

      const audioSource = TONE_ASSETS[assetKey] || TONE_ASSETS['1000_both'];

      // 3. Stop previous instance if any
      if (playerRef.current) {
        try {
          playerRef.current.pause();
          playerRef.current.release();
        } catch (e) {}
        playerRef.current = null;
      }

      // 4. Create player instance and start looping tone
      const player = createAudioPlayer(audioSource);
      player.loop = true;
      player.volume = 1.0;
      player.play();
      playerRef.current = player;
      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio tone error:', err);
      setPlaybackError(err.message || 'Could not start audio tone.');
      setIsPlaying(false);
    }
  };

  const handleSelectFreq = (freq) => {
    setSelectedFreq(freq);
    if (isPlaying) {
      stopPlayback();
    }
  };

  const handleSelectChannel = (ch) => {
    setSelectedChannel(ch);
    if (isPlaying) {
      stopPlayback();
    }
  };

  const currentFreqObj = FREQUENCIES.find((f) => f.freq === selectedFreq) || FREQUENCIES[1];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#050811" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleWrap}>
            <Ionicons name="volume-high-outline" size={22} color="#00F2FE" />
            <Text style={styles.headerTitle}>Acoustic & Audio Lab</Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              stopPlayback();
              onClose();
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Volume Reminder Notice */}
          <View style={styles.volumeNotice}>
            <Ionicons name="volume-high" size={16} color="#00F2FE" />
            <Text style={styles.volumeNoticeText}>
              Turn up your device’s <Text style={{ fontWeight: '800', color: '#00F2FE' }}>Media Volume</Text> using the physical volume buttons.
            </Text>
          </View>

          {/* Visualizer Hero Card */}
          <View style={styles.visualizerCard}>
            <View style={styles.visualizerHeader}>
              <View>
                <Text style={styles.activeFreqText}>
                  {selectedChannel !== 'both' ? '1 kHz Pan Test' : currentFreqObj.name}
                </Text>
                <Text style={styles.activeBandText}>
                  {selectedChannel === 'both'
                    ? currentFreqObj.band
                    : selectedChannel === 'left'
                    ? 'Top / Earpiece Channel'
                    : 'Bottom Loudspeaker Channel'}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  isPlaying ? styles.statusPlaying : styles.statusIdle,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isPlaying ? '#10B981' : '#64748B' },
                  ]}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: isPlaying ? '#10B981' : '#94A3B8' },
                  ]}
                >
                  {isPlaying ? 'PLAYING SOUND' : 'STANDBY'}
                </Text>
              </View>
            </View>

            {/* Spectrum Wave Bars */}
            <View style={styles.waveformContainer}>
              {barAnims.map((anim, idx) => (
                <View key={`bar_${idx}`} style={styles.barWrapper}>
                  <Animated.View
                    style={[
                      styles.barFill,
                      {
                        transform: [{ scaleY: anim }],
                        backgroundColor: isPlaying ? '#00F2FE' : 'rgba(255, 255, 255, 0.1)',
                      },
                    ]}
                  />
                </View>
              ))}
            </View>

            {/* Large Play / Stop CTA */}
            <TouchableOpacity
              style={[
                styles.playButton,
                isPlaying ? styles.playButtonActive : styles.playButtonIdle,
              ]}
              onPress={togglePlayback}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'volume-high'}
                size={22}
                color={isPlaying ? '#070B14' : '#070B14'}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.playButtonText}>
                {isPlaying
                  ? 'Stop Audio Tone'
                  : `Emit ${currentFreqObj.name} Sound Tone`}
              </Text>
            </TouchableOpacity>

            {playbackError ? (
              <Text style={styles.errorText}>{playbackError}</Text>
            ) : null}
          </View>

          {/* Section 1: Frequency Calibration Selection */}
          <Text style={styles.sectionHeading}>Speaker Frequency Sweeps</Text>
          <View style={styles.freqGrid}>
            {FREQUENCIES.map((f) => {
              const isSelected = selectedFreq === f.freq && selectedChannel === 'both';
              return (
                <TouchableOpacity
                  key={`freq_${f.freq}`}
                  style={[
                    styles.freqCard,
                    isSelected && styles.freqCardSelected,
                  ]}
                  onPress={() => {
                    setSelectedChannel('both');
                    handleSelectFreq(f.freq);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.freqCardHeader}>
                    <Text
                      style={[
                        styles.freqName,
                        isSelected && { color: '#00F2FE' },
                      ]}
                    >
                      {f.name}
                    </Text>
                    <Ionicons
                      name={f.icon}
                      size={16}
                      color={isSelected ? '#00F2FE' : '#64748B'}
                    />
                  </View>
                  <Text style={styles.freqBand}>{f.band}</Text>
                  <Text style={styles.freqDesc} numberOfLines={2}>
                    {f.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 2: Speaker Channel Driver Mapping */}
          <Text style={styles.sectionHeading}>Stereo Speaker Channels</Text>
          <View style={styles.channelRow}>
            {CHANNELS.map((ch) => {
              const isSelected = selectedChannel === ch.id;
              return (
                <TouchableOpacity
                  key={`channel_${ch.id}`}
                  style={[
                    styles.channelBtn,
                    isSelected && styles.channelBtnSelected,
                  ]}
                  onPress={() => handleSelectChannel(ch.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={ch.icon}
                    size={16}
                    color={isSelected ? '#070B14' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.channelText,
                      isSelected && styles.channelTextSelected,
                    ]}
                  >
                    {ch.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 3: Hardware Verification Result */}
          <Text style={styles.sectionHeading}>Speaker Health Assessment</Text>
          <View style={styles.assessmentRow}>
            <TouchableOpacity
              style={[
                styles.assessBtn,
                assessment === 'pass' && {
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                },
              ]}
              onPress={() => setAssessment('pass')}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={assessment === 'pass' ? '#10B981' : '#64748B'}
              />
              <Text
                style={[
                  styles.assessText,
                  assessment === 'pass' && { color: '#10B981', fontWeight: '800' },
                ]}
              >
                Clear & Loud
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.assessBtn,
                assessment === 'rattle' && {
                  borderColor: '#F59E0B',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                },
              ]}
              onPress={() => setAssessment('rattle')}
            >
              <Ionicons
                name="warning-outline"
                size={18}
                color={assessment === 'rattle' ? '#F59E0B' : '#64748B'}
              />
              <Text
                style={[
                  styles.assessText,
                  assessment === 'rattle' && { color: '#F59E0B', fontWeight: '800' },
                ]}
              >
                Distortion / Buzz
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.assessBtn,
                assessment === 'silent' && {
                  borderColor: '#EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                },
              ]}
              onPress={() => setAssessment('silent')}
            >
              <Ionicons
                name="close-circle-outline"
                size={18}
                color={assessment === 'silent' ? '#EF4444' : '#64748B'}
              />
              <Text
                style={[
                  styles.assessText,
                  assessment === 'silent' && { color: '#EF4444', fontWeight: '800' },
                ]}
              >
                Silent / Defective
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050811',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  volumeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  volumeNoticeText: {
    color: '#E2E8F0',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  visualizerCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  visualizerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activeFreqText: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  activeBandText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 12,
    gap: 6,
  },
  statusPlaying: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusIdle: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  barWrapper: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  barFill: {
    width: 6,
    height: 56,
    borderRadius: 3,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 6,
  },
  playButtonIdle: {
    backgroundColor: '#00F2FE',
  },
  playButtonActive: {
    backgroundColor: '#10B981',
  },
  playButtonText: {
    color: '#070B14',
    fontSize: 14,
    fontWeight: '800',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionHeading: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  freqGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  freqCard: {
    flex: 1,
    minWidth: '47%',
    padding: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  freqCardSelected: {
    borderColor: '#00F2FE',
    backgroundColor: 'rgba(0, 242, 254, 0.07)',
  },
  freqCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  freqName: {
    color: '#F8FAFC',
    fontSize: 14.5,
    fontWeight: '800',
  },
  freqBand: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 3,
  },
  freqDesc: {
    color: '#64748B',
    fontSize: 10,
    lineHeight: 13.5,
  },
  channelRow: {
    flexDirection: 'column',
    gap: 7,
    marginBottom: 14,
  },
  channelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    gap: 8,
  },
  channelBtnSelected: {
    backgroundColor: '#00F2FE',
    borderColor: '#00F2FE',
  },
  channelText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  channelTextSelected: {
    color: '#070B14',
  },
  assessmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  assessBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    gap: 4,
  },
  assessText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
