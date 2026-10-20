import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { formatBatteryLevel } from '../utils/formatters';

export function TopNavBar({
  hardwareModel,
  onRefresh,
  isRefreshing,
  batteryLevel,
  isCharging,
  onCopyReport,
}) {
  const { theme, isDark, toggleTheme, isSeniorMode, toggleSeniorMode, language, setLanguage } = useTheme();

  // Spin animation for refresh button
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRefreshing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [isRefreshing, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background, borderBottomColor: theme.divider }]}>
      <View style={styles.topRow}>
        {/* Brand & Model Column */}
        <View style={styles.brandColumn}>
          <View style={styles.badgeRow}>
            <View style={[styles.pulseDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.brandLabel, { color: theme.primary }]}>DEVICE SENTINEL</Text>
          </View>
          <Text style={[styles.modelTitle, { color: theme.textPrimary }]} numberOfLines={1}>
            {hardwareModel || 'Phone Status'}
          </Text>
        </View>

        {/* Right Action Buttons */}
        <View style={styles.rightGroup}>
          {batteryLevel !== null && (
            <View
              style={[
                styles.miniBatteryPill,
                {
                  backgroundColor: isCharging ? theme.primaryLight : theme.pillBg,
                  borderColor: isCharging ? `${theme.primary}44` : theme.cardBorder,
                },
              ]}
            >
              <Ionicons
                name={isCharging ? 'flash' : 'battery-charging'}
                size={12}
                color={isCharging ? theme.primary : theme.textSecondary}
              />
              <Text
                style={[
                  styles.miniBatteryText,
                  { color: isCharging ? theme.primary : theme.textPrimary },
                ]}
              >
                {formatBatteryLevel(batteryLevel)}
              </Text>
            </View>
          )}

          {/* Senior Mode Toggle (👓) */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: isSeniorMode ? 'rgba(0, 242, 254, 0.18)' : theme.card,
                borderColor: isSeniorMode ? '#00F2FE' : theme.cardBorder,
              },
            ]}
            onPress={toggleSeniorMode}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isSeniorMode ? 'glasses' : 'glasses-outline'}
              size={18}
              color={isSeniorMode ? '#00F2FE' : theme.textPrimary}
            />
          </TouchableOpacity>

          {/* Quick Language Switcher (EN / हि / తె) */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => {
              const next = language === 'en' ? 'hi' : language === 'hi' ? 'te' : 'en';
              setLanguage(next);
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.langBtnText, { color: theme.primary }]}>
              {language === 'hi' ? 'हि' : language === 'te' ? 'తె' : 'EN'}
            </Text>
          </TouchableOpacity>

          {/* Theme Switcher Toggle (Light ☀️ / Dark 🌙) */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={isDark ? '#FBBF24' : '#6366F1'}
            />
          </TouchableOpacity>

          {/* Copy Report */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={onCopyReport}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="share-outline" size={17} color={theme.textPrimary} />
          </TouchableOpacity>

          {/* Refresh Action */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
              isRefreshing && { opacity: 0.6 },
            ]}
            onPress={onRefresh}
            disabled={isRefreshing}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="refresh" size={17} color={theme.textPrimary} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandColumn: {
    flex: 1,
    paddingRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  brandLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  modelTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniBatteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  miniBatteryText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
