import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../styles/theme';

export const TABS = [
  { id: 'overview', label: 'Overview', icon: 'speedometer-outline', activeIcon: 'speedometer' },
  { id: 'battery', label: 'Battery', icon: 'battery-charging-outline', activeIcon: 'battery-charging' },
  { id: 'network', label: 'Network', icon: 'wifi-outline', activeIcon: 'wifi' },
  { id: 'hardware', label: 'Hardware', icon: 'hardware-chip-outline', activeIcon: 'hardware-chip' },
  { id: 'lab', label: 'Lab & Audit', icon: 'flask-outline', activeIcon: 'flask' },
];

export function BottomNavBar({ activeTab, onSelectTab }) {
  const handlePress = (tabId) => {
    try {
      Haptics.selectionAsync();
    } catch (e) {}
    onSelectTab(tabId);
  };

  return (
    <View style={styles.dockWrapper}>
      <View style={styles.dockContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => handlePress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={20}
                  color={isActive ? COLORS.primary : COLORS.textMuted}
                />
                {isActive && <View style={styles.activeGlowDot} />}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(13, 20, 36, 0.94)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 14,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  activeGlowDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});

