import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export function SectionCard({
  icon,
  iconColor,
  title,
  subtitle,
  badge,
  children,
  accentColor,
  style,
  onPress,
  onHelpPress,
}) {
  const { theme } = useTheme();

  const effectiveIconColor = iconColor || theme.primary;
  const effectiveAccent = accentColor || theme.primary;

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
        theme.cardShadow,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {/* Card Header */}
      <View style={[styles.header, { borderBottomColor: theme.divider }]}>
        <View style={styles.titleRow}>
          {icon && (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${effectiveIconColor}16` },
              ]}
            >
              <Ionicons name={icon} size={20} color={effectiveIconColor} />
            </View>
          )}
          <View style={styles.titleTextContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.headerRightGroup}>
          {badge}
          {onHelpPress && (
            <TouchableOpacity
              style={[
                styles.helpIconButton,
                { backgroundColor: `${effectiveIconColor}16` },
              ]}
              onPress={onHelpPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="help-circle-outline"
                size={18}
                color={effectiveIconColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Card Content Body */}
      <View style={styles.body}>{children}</View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
  body: {
    padding: 18,
  },
});
