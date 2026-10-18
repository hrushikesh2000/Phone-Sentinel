import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

export function StatBadge({ label, variant = 'neutral', size = 'medium' }) {
  let bgColor = 'rgba(148, 163, 184, 0.15)';
  let textColor = COLORS.textSecondary;
  let borderColor = 'rgba(148, 163, 184, 0.25)';

  switch (variant) {
    case 'success':
      bgColor = COLORS.successBg;
      textColor = COLORS.success;
      borderColor = 'rgba(16, 185, 129, 0.3)';
      break;
    case 'cyan':
    case 'primary':
      bgColor = 'rgba(0, 242, 254, 0.12)';
      textColor = COLORS.primary;
      borderColor = 'rgba(0, 242, 254, 0.3)';
      break;
    case 'warning':
      bgColor = COLORS.warningBg;
      textColor = COLORS.warning;
      borderColor = 'rgba(245, 158, 11, 0.3)';
      break;
    case 'danger':
      bgColor = COLORS.dangerBg;
      textColor = COLORS.danger;
      borderColor = 'rgba(244, 63, 94, 0.3)';
      break;
    case 'info':
      bgColor = COLORS.infoBg;
      textColor = COLORS.secondary;
      borderColor = 'rgba(56, 189, 248, 0.3)';
      break;
  }

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 3 : 5,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: textColor, fontSize: isSmall ? 11 : 12 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});

