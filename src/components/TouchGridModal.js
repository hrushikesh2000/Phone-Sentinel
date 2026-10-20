import React, { useState, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ExplainerModal } from './ExplainerModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GRID_COLS = 8;
const GRID_ROWS = 14;
const TOTAL_TILES = GRID_COLS * GRID_ROWS;

export function TouchGridModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'multitouch'
  const [touchedTiles, setTouchedTiles] = useState(() => new Set());
  const [activeTouches, setActiveTouches] = useState([]);
  const [peakTouches, setPeakTouches] = useState(0);
  const [explainerVisible, setExplainerVisible] = useState(false);

  // Store layout bounds of the grid container for coordinate translation
  const gridLayoutRef = useRef({ x: 0, y: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 160 });

  const triggerHaptic = useCallback((style = 'light') => {
    try {
      if (style === 'light') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (style === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e) {}
  }, []);

  const handleTileTouch = useCallback((col, row) => {
    const tileKey = `${col}_${row}`;
    setTouchedTiles((prev) => {
      if (prev.has(tileKey)) return prev;
      const next = new Set(prev);
      next.add(tileKey);
      if (next.size === TOTAL_TILES) {
        triggerHaptic('success');
      }
      return next;
    });
  }, [triggerHaptic]);

  // Touch handler for digitizer grid dragging
  const handleGridTouchMove = (evt) => {
    const touches = evt.nativeEvent.touches;
    if (!touches || touches.length === 0) return;

    const { x: gridX, y: gridY, width: gridW, height: gridH } = gridLayoutRef.current;
    const tileW = gridW / GRID_COLS;
    const tileH = gridH / GRID_ROWS;

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const relX = touch.pageX - gridX;
      const relY = touch.pageY - gridY;

      if (relX >= 0 && relX < gridW && relY >= 0 && relY < gridH) {
        const col = Math.floor(relX / tileW);
        const row = Math.floor(relY / tileH);
        if (col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS) {
          handleTileTouch(col, row);
        }
      }
    }
  };

  // Multi-Touch tracking handler
  const handleMultiTouch = (evt) => {
    const touches = evt.nativeEvent.touches || [];
    const points = [];
    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      points.push({
        id: t.identifier || i,
        x: t.pageX,
        y: t.pageY,
      });
    }

    setActiveTouches(points);
    if (points.length > peakTouches) {
      setPeakTouches(points.length);
      triggerHaptic('light');
    }
  };

  const handleTouchEnd = (evt) => {
    const remaining = evt.nativeEvent.touches || [];
    const points = [];
    for (let i = 0; i < remaining.length; i++) {
      const t = remaining[i];
      points.push({
        id: t.identifier || i,
        x: t.pageX,
        y: t.pageY,
      });
    }
    setActiveTouches(points);
  };

  const clearGrid = () => {
    triggerHaptic('light');
    setTouchedTiles(new Set());
  };

  const resetMultiTouch = () => {
    triggerHaptic('light');
    setActiveTouches([]);
    setPeakTouches(0);
  };

  const coveragePercent = Math.round((touchedTiles.size / TOTAL_TILES) * 100);
  const isComplete = touchedTiles.size === TOTAL_TILES;

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

        {/* Top Control Bar */}
        <View style={styles.topBar}>
          <View style={styles.headerTitleWrap}>
            <Ionicons name="finger-print-outline" size={20} color="#00F2FE" />
            <Text style={styles.headerTitle}>Touch Digitizer Lab</Text>
          </View>

          {/* Mode Switcher */}
          <View style={styles.tabsWrap}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'grid' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('grid');
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="grid-outline"
                size={14}
                color={activeTab === 'grid' ? '#070B14' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'grid' && styles.tabButtonTextActive,
                ]}
              >
                Dead Zones
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'multitouch' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('multitouch');
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="hand-left-outline"
                size={14}
                color={activeTab === 'multitouch' ? '#070B14' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'multitouch' && styles.tabButtonTextActive,
                ]}
              >
                Multi-Touch
              </Text>
            </TouchableOpacity>
          </View>

          {/* Actions: Help & Close */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setExplainerVisible(true)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="help-circle-outline" size={22} color="#00F2FE" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                triggerHaptic('light');
                onClose();
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Status & Metrics Sub-Bar */}
        {activeTab === 'grid' ? (
          <View style={styles.subBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Coverage</Text>
              <Text style={[styles.metricValue, isComplete && { color: '#10B981' }]}>
                {coveragePercent}% ({touchedTiles.size}/{TOTAL_TILES})
              </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${coveragePercent}%` },
                  isComplete && { backgroundColor: '#10B981' },
                ]}
              />
            </View>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={clearGrid}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={16} color="#94A3B8" />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.subBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Current Contacts</Text>
              <Text style={styles.metricValue}>
                {activeTouches.length} {activeTouches.length === 1 ? 'Finger' : 'Fingers'}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Peak Simultaneous</Text>
              <Text style={[styles.metricValue, { color: '#00F2FE' }]}>
                {peakTouches} Points
              </Text>
            </View>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={resetMultiTouch}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={16} color="#94A3B8" />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab 1: Interactive Digitizer Grid */}
        {activeTab === 'grid' && (
          <View
            style={styles.gridCanvas}
            onLayout={(e) => {
              e.target.measure((x, y, width, height, pageX, pageY) => {
                gridLayoutRef.current = { x: pageX, y: pageY, width, height };
              });
            }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleGridTouchMove}
            onResponderMove={handleGridTouchMove}
          >
            {Array.from({ length: GRID_ROWS }).map((_, rowIndex) => (
              <View key={`row_${rowIndex}`} style={styles.gridRow}>
                {Array.from({ length: GRID_COLS }).map((_, colIndex) => {
                  const isTouched = touchedTiles.has(`${colIndex}_${rowIndex}`);
                  return (
                    <View
                      key={`cell_${colIndex}_${rowIndex}`}
                      style={[
                        styles.gridCell,
                        isTouched ? styles.cellTouched : styles.cellUntouched,
                      ]}
                    >
                      {isTouched && (
                        <Ionicons name="checkmark" size={11} color="#070B14" />
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        {/* Tab 2: Multi-Touch Canvas */}
        {activeTab === 'multitouch' && (
          <View
            style={styles.multiTouchCanvas}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleMultiTouch}
            onResponderMove={handleMultiTouch}
            onResponderRelease={handleTouchEnd}
            onResponderTerminate={handleTouchEnd}
          >
            {activeTouches.length === 0 ? (
              <View style={styles.touchHintContainer} pointerEvents="none">
                <Ionicons name="finger-print-outline" size={64} color="rgba(0, 242, 254, 0.25)" />
                <Text style={styles.touchHintTitle}>Place Fingers on Screen</Text>
                <Text style={styles.touchHintDesc}>
                  Touch with multiple fingers simultaneously. The hardware digitizer tracks multi-contact capacitive points in real-time.
                </Text>
              </View>
            ) : null}

            {/* Glowing Touch Reticles */}
            {activeTouches.map((touch, idx) => (
              <View
                key={`touch_${touch.id || idx}`}
                style={[
                  styles.touchIndicator,
                  {
                    left: touch.x - 45,
                    top: touch.y - 120, // offset for top navigation bars
                  },
                ]}
                pointerEvents="none"
              >
                <View style={styles.touchOuterRing} />
                <View style={styles.touchInnerCircle}>
                  <Text style={styles.touchNumberText}>{idx + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Plain-English Touch Explainer */}
        <ExplainerModal
          visible={explainerVisible}
          topicKey="touch_digitizer"
          onClose={() => setExplainerVisible(false)}
        />
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
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tabsWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
    gap: 5,
  },
  tabButtonActive: {
    backgroundColor: '#00F2FE',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabButtonTextActive: {
    color: '#070B14',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    gap: 12,
  },
  metricItem: {
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 1,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00F2FE',
    borderRadius: 4,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  resetBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  gridCanvas: {
    flex: 1,
    padding: 8,
    gap: 4,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  gridCell: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellUntouched: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  cellTouched: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  multiTouchCanvas: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#050811',
  },
  touchHintContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  touchHintTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  touchHintDesc: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  touchIndicator: {
    position: 'absolute',
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchOuterRing: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: '#00F2FE',
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
  },
  touchInnerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  touchNumberText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#070B14',
  },
});
