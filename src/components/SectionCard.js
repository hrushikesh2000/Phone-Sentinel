import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';

export function SectionCard({
  icon,
  iconColor = COLORS.primary,
  title,
  subtitle,
  badge,
  children,
  accentColor = COLORS.primary,
  style,
}) {
  return (
    <View style={[styles.card, style]}>
      {/* Subtle top neon accent line */}
      <View style={[styles.topAccent, { backgroundColor: accentColor }]} />

      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}18` }]}>
              <Ionicons name={icon} size={20} color={iconColor} />
            </View>
          )}
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {badge}
      </View>

      {/* Card Content Body */}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  topAccent: {
    height: 3,
    width: '100%',
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  body: {
    padding: 16,
  },
});

