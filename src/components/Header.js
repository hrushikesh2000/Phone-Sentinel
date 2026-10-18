import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';
import { StatBadge } from './StatBadge';

export function Header({ isDevice, onRefresh, isRefreshing }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <View style={styles.brandBadgeRow}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>SYSTEM MONITOR ACTIVE</Text>
          </View>
          <Text style={styles.mainTitle}>Device Sentinel</Text>
          <Text style={styles.subTitle}>Hardware Diagnostics & Info</Text>
        </View>

        <TouchableOpacity
          style={[styles.refreshButton, isRefreshing && styles.refreshingButton]}
          onPress={onRefresh}
          disabled={isRefreshing}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh"
            size={18}
            color={COLORS.primary}
            style={isRefreshing ? styles.spinIcon : null}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tagRow}>
        <StatBadge
          label={isDevice ? 'Physical Hardware' : 'Simulator / Emulator'}
          variant={isDevice ? 'success' : 'warning'}
          size="small"
        />
        <View style={styles.spacer} />
        <StatBadge
          label="Privacy Compliant (Expo Go)"
          variant="cyan"
          size="small"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleArea: {
    flex: 1,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  refreshingButton: {
    opacity: 0.6,
  },
  spinIcon: {
    transform: [{ rotate: '45deg' }],
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  spacer: {
    width: 8,
  },
});

