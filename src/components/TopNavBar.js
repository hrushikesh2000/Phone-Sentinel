import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';
import { formatBatteryLevel } from '../utils/formatters';

export function TopNavBar({
  hardwareModel,
  onRefresh,
  isRefreshing,
  batteryLevel,
  isCharging,
  onCopyReport,
}) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {/* Brand & Model Column */}
        <View style={styles.brandColumn}>
          <View style={styles.liveBadgeRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.sentinelLabel}>DEVICE SENTINEL</Text>
          </View>
          <Text style={styles.modelTitle} numberOfLines={1}>
            {hardwareModel || 'Hardware Diagnostics'}
          </Text>
        </View>

        {/* Right Action Buttons */}
        <View style={styles.rightGroup}>
          {batteryLevel !== null && (
            <View style={[styles.miniBatteryPill, isCharging && styles.miniBatteryPillCharging]}>
              <Ionicons
                name={isCharging ? 'flash' : 'battery-charging'}
                size={12}
                color={isCharging ? COLORS.primary : COLORS.textPrimary}
              />
              <Text style={styles.miniBatteryText}>
                {formatBatteryLevel(batteryLevel)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onCopyReport}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="document-text-outline" size={17} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, isRefreshing && styles.refreshingActionBtn]}
            onPress={onRefresh}
            disabled={isRefreshing}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="refresh"
              size={17}
              color={COLORS.textPrimary}
              style={isRefreshing ? styles.spinIcon : null}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 47, 77, 0.4)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandColumn: {
    flex: 1,
    paddingRight: 12,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  sentinelLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  modelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniBatteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  miniBatteryPillCharging: {
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  miniBatteryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 27, 46, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshingActionBtn: {
    opacity: 0.5,
  },
  spinIcon: {
    transform: [{ rotate: '45deg' }],
  },
});
