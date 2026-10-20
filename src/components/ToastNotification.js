import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export function ToastNotification({ visible, message, onHide }) {
  const { theme, isDark } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.delay(2200),
        Animated.timing(anim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onHide) onHide();
      });
    }
  }, [visible, anim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: theme.cardElevated,
            borderColor: theme.cardBorder,
          },
          theme.cardShadow,
        ]}
      >
        <Ionicons name="checkmark-circle" size={19} color={theme.success} style={styles.toastIcon} />
        <Text style={[styles.toastText, { color: theme.textPrimary }]}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  toastIcon: {
    marginRight: 9,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
