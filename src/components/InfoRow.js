import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

export function InfoRow({
  label,
  value,
  subvalue,
  badge,
  isLast = false,
  highlight = false,
}) {
  return (
    <View style={[styles.container, !isLast && styles.borderBottom]}>
      <View style={styles.labelColumn}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueColumn}>
        {value !== undefined && (
          <Text
            style={[
              styles.value,
              highlight && styles.highlightText,
            ]}
            numberOfLines={2}
          >
            {value}
          </Text>
        )}
        {subvalue && <Text style={styles.subvalue}>{subvalue}</Text>}
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
    paddingVertical: 11,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.35)',
  },
  labelColumn: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  valueColumn: {
    flex: 1.3,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  value: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  subvalue: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: 'right',
  },
});

