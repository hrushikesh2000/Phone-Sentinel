import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ExplainerAnimation } from './ExplainerAnimation';
import { EXPLAINER_GLOSSARY } from '../utils/explainerGlossary';
import { useTheme } from '../context/ThemeContext';

export function ExplainerModal({ visible, topicKey, onClose }) {
  const { language = 'en', t } = useTheme();

  if (!topicKey) return null;
  const data = EXPLAINER_GLOSSARY[topicKey];
  if (!data) return null;

  const handleClose = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onClose();
  };

  // Resolve localized text strings
  const getLocalized = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field.en || '';
  };

  const title = getLocalized(data.title);
  const analogy = getLocalized(data.analogy);
  const testedBullets = Array.isArray(data.tested)
    ? data.tested
    : (data.tested && data.tested[language]) || (data.tested && data.tested.en) || [];
  const actionTip = getLocalized(data.action);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#050811" />

        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.headerTitleWrap}>
            <Ionicons name="help-circle-outline" size={22} color={data.color || '#00F2FE'} />
            <Text style={styles.headerTitle}>
              {language === 'hi' ? 'फोन को समझें' : language === 'te' ? 'ఫోన్ వివరాలు' : 'Quick Guide'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Title & Category Badge */}
          <View style={styles.heroTitleCard}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: `${data.color || '#00F2FE'}18` },
              ]}
            >
              <Ionicons
                name={data.icon || 'information-circle'}
                size={14}
                color={data.color || '#00F2FE'}
              />
              <Text
                style={[
                  styles.categoryBadgeText,
                  { color: data.color || '#00F2FE' },
                ]}
              >
                {data.badge || 'Hardware'}
              </Text>
            </View>

            <Text style={styles.topicMainTitle}>{title}</Text>
          </View>

          {/* Mini-Animated Visual Demonstration */}
          <ExplainerAnimation
            type={data.animationType}
            color={data.color || '#00F2FE'}
          />

          {/* Card 1: 💡 In Simple Words / Analogy */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: 'rgba(0, 242, 254, 0.12)' }]}>
                <Ionicons name="bulb-outline" size={18} color="#00F2FE" />
              </View>
              <Text style={styles.cardHeaderTitle}>{t('explainer_simple')}</Text>
            </View>
            <Text style={styles.analogyText}>{analogy}</Text>
          </View>

          {/* Card 2: 🔍 What It Checks (2 Bullet Points Max) */}
          {testedBullets.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: 'rgba(99, 102, 241, 0.14)' }]}>
                  <Ionicons name="checkmark-done-circle-outline" size={18} color="#818CF8" />
                </View>
                <Text style={styles.cardHeaderTitle}>{t('explainer_checks')}</Text>
              </View>
              {testedBullets.map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Card 3:  Doctor's Physical Action */}
          {actionTip ? (
            <View style={[styles.infoCard, styles.actionCard]}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="medkit-outline" size={17} color="#10B981" />
                </View>
                <Text style={[styles.cardHeaderTitle, { color: '#10B981' }]}>
                  {t('explainer_action')}
                </Text>
              </View>
              <Text style={styles.actionBodyText}>{actionTip}</Text>
            </View>
          ) : null}

          {/* Giant Got It Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleClose}
            activeOpacity={0.85}
          >
            <Text style={styles.doneBtnText}>{t('explainer_got_it')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050811',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  heroTitleCard: {
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  topicMainTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  infoCard: {
    backgroundColor: '#0C1222',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },
  actionCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardHeaderIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  analogyText: {
    color: '#E2E8F0',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#818CF8',
    marginTop: 7,
  },
  bulletText: {
    color: '#CBD5E1',
    fontSize: 13.5,
    lineHeight: 20,
    flex: 1,
  },
  actionBodyText: {
    color: '#D1FAE5',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#00F2FE',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  doneBtnText: {
    color: '#050811',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
