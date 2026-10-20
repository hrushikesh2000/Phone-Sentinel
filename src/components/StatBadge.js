import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function StatBadge({ label, variant = 'neutral', size = 'medium' }) {
  const { theme } = useTheme();

  let bgColor = theme.pillBg;
  let textColor = theme.textSecondary;
  let borderColor = 'transparent';

  switch (variant) {
    case 'success':
      bgColor = theme.successBg;
      textColor = theme.success;
      borderColor = `${theme.success}33`;
      break;
    case 'cyan':
    case 'primary':
      bgColor = theme.primaryLight;
      textColor = theme.primary;
      borderColor = `${theme.primary}33`;
      break;
    case 'warning':
      bgColor = theme.warningBg;
      textColor = theme.warning;
      borderColor = `${theme.warning}33`;
      break;
    case 'danger':
      bgColor = theme.dangerBg;
      textColor = theme.danger;
      borderColor = `${theme.danger}33`;
      break;
    case 'info':
      bgColor = theme.infoBg;
      textColor = theme.info;
      borderColor = `${theme.info}33`;
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
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 3 : 5,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: textColor, fontSize: isSmall ? 10.5 : 12 }]}>
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
    letterSpacing: 0.2,
  },
});
