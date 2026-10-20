import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function InfoRow({
  label,
  value,
  subvalue,
  badge,
  isLast = false,
  highlight = false,
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.divider }]}>
      <View style={styles.labelColumn}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      </View>
      <View style={styles.valueColumn}>
        {value !== undefined && (
          <Text
            style={[
              styles.value,
              { color: highlight ? theme.primary : theme.textPrimary },
              highlight && styles.highlightText,
            ]}
            numberOfLines={2}
          >
            {value}
          </Text>
        )}
        {subvalue && <Text style={[styles.subvalue, { color: theme.textMuted }]}>{subvalue}</Text>}
        {badge}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  labelColumn: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  valueColumn: {
    flex: 1.4,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    letterSpacing: -0.1,
  },
  highlightText: {
    fontWeight: '700',
  },
  subvalue: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'right',
  },
});
