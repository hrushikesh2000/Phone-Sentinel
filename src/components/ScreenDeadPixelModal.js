import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ExplainerModal } from './ExplainerModal';

const TEST_COLORS = [
  { name: 'Pure Red', hex: '#FF0000', textLight: true },
  { name: 'Pure Green', hex: '#00FF00', textLight: false },
  { name: 'Pure Blue', hex: '#0000FF', textLight: true },
  { name: 'Solid White', hex: '#FFFFFF', textLight: false },
  { name: 'True Black (OLED)', hex: '#000000', textLight: true },
  { name: 'Vibrant Magenta', hex: '#FF00FF', textLight: true },
];

export function ScreenDeadPixelModal({ visible, onClose }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [explainerVisible, setExplainerVisible] = useState(false);

  const currentColor = TEST_COLORS[colorIndex];

  const handleNextColor = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}

    setColorIndex((prev) => (prev + 1) % TEST_COLORS.length);
    setShowHint(false);
  };

  const handleClose = () => {
    try {
      Haptics.selectionAsync();
    } catch (e) {}
    setColorIndex(0);
    setShowHint(true);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar hidden />
      <TouchableOpacity
        style={[styles.canvas, { backgroundColor: currentColor.hex }]}
        onPress={handleNextColor}
        activeOpacity={1}
      >
        {/* Floating Top Controls */}
        <View style={styles.topControlBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.colorPill}>
              <Text
                style={[
                  styles.colorPillText,
                  { color: currentColor.textLight ? '#FFFFFF' : '#000000' },
                ]}
              >
                {currentColor.name} ({colorIndex + 1}/{TEST_COLORS.length})
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.helpButton,
                { backgroundColor: currentColor.textLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.7)' },
              ]}
              onPress={() => setExplainerVisible(true)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name="help-circle-outline"
                size={18}
                color={currentColor.textLight ? '#FFFFFF' : '#000000'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons
              name="close-circle"
              size={32}
              color={currentColor.textLight ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)'}
            />
          </TouchableOpacity>
        </View>

        {/* Informational Hint (Fades after tap) */}
        {showHint && (
          <View style={styles.hintContainer}>
            <View style={styles.hintCard}>
              <Ionicons name="scan-outline" size={26} color="#00F2FE" />
              <Text style={styles.hintTitle}>Dead Pixel & Display Audit</Text>
              <Text style={styles.hintText}>
                Tap anywhere on screen to cycle solid primary colors. Inspect display for stuck, unlit, or discolored pixels.
              </Text>

              <TouchableOpacity
                style={styles.hintExplainerBtn}
                onPress={() => setExplainerVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="help-circle" size={15} color="#00F2FE" />
                <Text style={styles.hintExplainerText}>What is a dead pixel? (Tap to learn)</Text>
              </TouchableOpacity>

              <Text style={styles.hintDismiss}>Tap screen to proceed</Text>
            </View>
          </View>
        )}

        {/* Plain-English Display Explainer */}
        <ExplainerModal
          visible={explainerVisible}
          topicKey="screen_dead_pixels"
          onClose={() => setExplainerVisible(false)}
        />
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 36,
  },
  colorPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  colorPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  hintContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  hintCard: {
    backgroundColor: 'rgba(10, 16, 29, 0.92)',
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    maxWidth: 320,
  },
  hintTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 6,
    textAlign: 'center',
  },
  hintText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  hintDismiss: {
    color: '#00F2FE',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  hintExplainerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 14,
    gap: 6,
  },
  hintExplainerText: {
    color: '#00F2FE',
    fontSize: 12,
    fontWeight: '700',
  },
});

