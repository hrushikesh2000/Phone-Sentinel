import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export const TABS = [
  { id: 'overview', label: 'Home', icon: 'sparkles-outline', activeIcon: 'sparkles' },
  { id: 'battery', label: 'Battery', icon: 'battery-charging-outline', activeIcon: 'battery-charging' },
  { id: 'network', label: 'Network', icon: 'wifi-outline', activeIcon: 'wifi' },
  { id: 'hardware', label: 'Specs', icon: 'hardware-chip-outline', activeIcon: 'hardware-chip' },
  { id: 'lab', label: 'Lab', icon: 'flask-outline', activeIcon: 'flask' },
];

export function BottomNavBar({ activeTab, onSelectTab }) {
  const { theme, isDark } = useTheme();

  const handlePress = (tabId) => {
    try {
      Haptics.selectionAsync();
    } catch (e) {}
    onSelectTab(tabId);
  };

  return (
    <View style={styles.dockWrapper}>
      <View
        style={[
          styles.dockContainer,
          {
            backgroundColor: theme.dockBg,
            borderColor: theme.dockBorder,
          },
          theme.cardShadow,
        ]}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                isActive && {
                  backgroundColor: theme.primaryLight,
                },
              ]}
              onPress={() => handlePress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={20}
                  color={isActive ? theme.primary : theme.textMuted}
                />
                {isActive && (
                  <View
                    style={[
                      styles.activeGlowDot,
                      {
                        backgroundColor: theme.primary,
                        shadowColor: theme.primary,
                      },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? theme.primary : theme.textMuted,
                    fontWeight: isActive ? '800' : '500',
                  },
                ]}
              >
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 16,
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
