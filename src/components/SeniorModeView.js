import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { GuidedCheckupModal } from './GuidedCheckupModal';
import { sharePhoneHealthWithFamily } from '../utils/familyShare';
import { formatBytes } from '../utils/formatters';

export function SeniorModeView({
  hardware = {},
  batteryData = {},
  networkInfo = {},
  onNavigateTab,
}) {
  const { theme, isDark, t, language, setLanguage, toggleSeniorMode } = useTheme();
  const [checkupModalVisible, setCheckupModalVisible] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const percentage =
    batteryData.batteryLevel !== null && batteryData.batteryLevel >= 0
      ? Math.round(batteryData.batteryLevel * 100)
      : 100;

  const isCharging = batteryData.batteryState === 2 || batteryData.batteryState === 3;

  const handleShare = async () => {
    const res = await sharePhoneHealthWithFamily({
      hardware,
      batteryData,
      language,
    });
    if (res.success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 4000);
    }
  };

  const handleOpenCheckup = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    setCheckupModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Banner & Mode Indicator */}
      <View
        style={[
          styles.seniorBanner,
          {
            backgroundColor: isDark ? 'rgba(0, 242, 254, 0.08)' : '#E0F2FE',
            borderColor: isDark ? 'rgba(0, 242, 254, 0.25)' : '#BAE6FD',
          },
        ]}
      >
        <View style={styles.seniorBannerLeft}>
          <View style={styles.seniorBadge}>
            <Ionicons name="glasses-outline" size={18} color="#00F2FE" />
            <Text style={styles.seniorBadgeText}>{t('senior_mode')}</Text>
          </View>
          <Text style={[styles.seniorSubText, { color: theme.textSecondary }]}>
            {t('senior_mode_desc')}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.switchModeBtn,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
            },
          ]}
          onPress={toggleSeniorMode}
          activeOpacity={0.7}
        >
          <Text style={[styles.switchModeText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Standard
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Language Selector Bar (EN | हिन्दी | తెలుగు) */}
      <View
        style={[
          styles.languageBar,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: theme.cardBorder,
            borderWidth: isDark ? 0 : 1,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.langPill, language === 'en' && styles.langPillActive]}
          onPress={() => setLanguage('en')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              { color: isDark ? '#94A3B8' : '#475569' },
              language === 'en' && styles.langTextActive,
            ]}
          >
            English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langPill, language === 'hi' && styles.langPillActive]}
          onPress={() => setLanguage('hi')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              { color: isDark ? '#94A3B8' : '#475569' },
              language === 'hi' && styles.langTextActive,
            ]}
          >
            हिन्दी
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langPill, language === 'te' && styles.langPillActive]}
          onPress={() => setLanguage('te')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.langText,
              { color: isDark ? '#94A3B8' : '#475569' },
              language === 'te' && styles.langTextActive,
            ]}
          >
            తెలుగు
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Hero 1-Tap Doctor Checkup Button */}
      <TouchableOpacity
        style={styles.heroCheckupBtn}
        onPress={handleOpenCheckup}
        activeOpacity={0.85}
      >
        <View style={styles.checkupIconWrap}>
          <Ionicons name="medkit" size={30} color="#050811" />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.heroCheckupTitle}>{t('doctor_checkup_btn')}</Text>
          <Text style={styles.heroCheckupSub}>{t('doctor_checkup_sub')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#050811" />
      </TouchableOpacity>

      {/* 4. 1-Tap WhatsApp Family Help Button */}
      <TouchableOpacity
        style={styles.heroWhatsAppBtn}
        onPress={handleShare}
        activeOpacity={0.85}
      >
        <Ionicons name="logo-whatsapp" size={26} color="#FFFFFF" style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.whatsAppTitle}>
            {shareSuccess ? '✓ ' + t('whatsapp_copied') : t('ask_family_btn')}
          </Text>
          <Text style={styles.whatsAppSub}>{t('ask_family_sub')}</Text>
        </View>
      </TouchableOpacity>

      {/* 5. The 4 Big Friendly Status Tiles */}
      <View style={styles.tileList}>
        {/* Battery Tile */}
        <View
          style={[
            styles.seniorTile,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            theme.cardShadow,
          ]}
        >
          <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="battery-charging" size={28} color="#10B981" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.tileTitle, { color: theme.textPrimary }]}>
              {t('battery_title')}: {percentage}%
            </Text>
            <Text style={styles.tileStatusGreen}>
              {isCharging ? t('battery_status_charging') : t('battery_status_good')}
            </Text>
          </View>
        </View>

        {/* Sound & Speaker Tile */}
        <TouchableOpacity
          style={[
            styles.seniorTile,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            theme.cardShadow,
          ]}
          onPress={() => onNavigateTab && onNavigateTab('lab')}
          activeOpacity={0.75}
        >
          <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(0, 242, 254, 0.15)' }]}>
            <Ionicons name="volume-high" size={28} color="#00F2FE" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.tileTitle, { color: theme.textPrimary }]}>
              {t('sound_title')}
            </Text>
            <Text style={styles.tileStatusCyan}>{t('sound_status_good')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        {/* Storage Tile */}
        <View
          style={[
            styles.seniorTile,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            theme.cardShadow,
          ]}
        >
          <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(129, 140, 248, 0.15)' }]}>
            <Ionicons name="folder-outline" size={28} color="#818CF8" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.tileTitle, { color: theme.textPrimary }]}>
              {t('storage_title')}
            </Text>
            <Text style={styles.tileStatusIndigo}>
              {hardware.freeStorage ? `${formatBytes(hardware.freeStorage, 0)} Free` : t('storage_status_good')}
            </Text>
          </View>
        </View>

        {/* Internet Connection Tile */}
        <View
          style={[
            styles.seniorTile,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            theme.cardShadow,
          ]}
        >
          <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
            <Ionicons name="wifi-outline" size={28} color="#38BDF8" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.tileTitle, { color: theme.textPrimary }]}>
              {t('internet_title')}
            </Text>
            <Text style={styles.tileStatusSky}>
              {networkInfo.isConnected ? t('internet_status_online') : t('internet_status_offline')}
            </Text>
          </View>
        </View>
      </View>

      {/* 6. Doctor's Prescription (Healthy Habit Tips) */}
      <View
        style={[
          styles.prescriptionCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
          theme.cardShadow,
        ]}
      >
        <View style={styles.rxHeaderRow}>
          <Ionicons name="medkit-outline" size={22} color="#00F2FE" />
          <Text style={[styles.rxTitle, { color: theme.textPrimary }]}>
            {t('prescription_title')}
          </Text>
        </View>

        <View style={styles.rxItem}>
          <View
            style={[
              styles.rxNumberCircle,
              { backgroundColor: isDark ? 'rgba(0, 242, 254, 0.15)' : 'rgba(2, 132, 199, 0.12)' },
            ]}
          >
            <Text style={[styles.rxNumberText, { color: isDark ? '#00F2FE' : '#0284C7' }]}>1</Text>
          </View>
          <Text style={[styles.rxText, { color: theme.textSecondary }]}>{t('tip_1')}</Text>
        </View>

        <View style={styles.rxItem}>
          <View
            style={[
              styles.rxNumberCircle,
              { backgroundColor: isDark ? 'rgba(0, 242, 254, 0.15)' : 'rgba(2, 132, 199, 0.12)' },
            ]}
          >
            <Text style={[styles.rxNumberText, { color: isDark ? '#00F2FE' : '#0284C7' }]}>2</Text>
          </View>
          <Text style={[styles.rxText, { color: theme.textSecondary }]}>{t('tip_2')}</Text>
        </View>

        <View style={styles.rxItem}>
          <View
            style={[
              styles.rxNumberCircle,
              { backgroundColor: isDark ? 'rgba(0, 242, 254, 0.15)' : 'rgba(2, 132, 199, 0.12)' },
            ]}
          >
            <Text style={[styles.rxNumberText, { color: isDark ? '#00F2FE' : '#0284C7' }]}>3</Text>
          </View>
          <Text style={[styles.rxText, { color: theme.textSecondary }]}>{t('tip_3')}</Text>
        </View>
      </View>

      {/* Doctor Checkup Modal */}
      <GuidedCheckupModal
        visible={checkupModalVisible}
        onClose={() => setCheckupModalVisible(false)}
        hardware={hardware}
        batteryData={batteryData}
        networkInfo={networkInfo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  seniorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  seniorBannerLeft: {
    flex: 1,
  },
  seniorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seniorBadgeText: {
    color: '#00F2FE',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  seniorSubText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  switchModeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  switchModeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  languageBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 6,
  },
  langPill: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  langPillActive: {
    backgroundColor: '#00F2FE',
  },
  langText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  langTextActive: {
    color: '#050811',
    fontWeight: '800',
  },
  heroCheckupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00F2FE',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  checkupIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(5, 8, 17, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCheckupTitle: {
    color: '#050811',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroCheckupSub: {
    color: 'rgba(5, 8, 17, 0.75)',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
  heroWhatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  whatsAppTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  whatsAppSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  tileList: {
    gap: 12,
    marginBottom: 16,
  },
  seniorTile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  tileIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  tileStatusGreen: {
    color: '#10B981',
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 2,
  },
  tileStatusCyan: {
    color: '#00F2FE',
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 2,
  },
  tileStatusIndigo: {
    color: '#818CF8',
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 2,
  },
  tileStatusSky: {
    color: '#38BDF8',
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 2,
  },
  prescriptionCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  rxHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  rxTitle: {
    fontSize: 15.5,
    fontWeight: '800',
  },
  rxItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  rxNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  rxNumberText: {
    color: '#00F2FE',
    fontSize: 12,
    fontWeight: '800',
  },
  rxText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
  },
});

