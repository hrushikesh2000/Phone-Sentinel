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

export function ExplainerModal({ visible, topicKey, onClose }) {
  if (!topicKey) return null;
  const data = EXPLAINER_GLOSSARY[topicKey];
  if (!data) return null;

  const handleClose = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onClose();
  };

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
            <Text style={styles.headerTitle}>Understanding Your Phone</Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                {data.badge || 'Diagnostic Topic'}
              </Text>
            </View>

            <Text style={styles.topicMainTitle}>{data.title}</Text>
          </View>

          {/* Mini-Animated Visual Demonstration */}
          <ExplainerAnimation
            type={data.animationType}
            color={data.color || '#00F2FE'}
          />

          {/* 1. In Simple Words */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: 'rgba(0, 242, 254, 0.12)' }]}>
                <Ionicons name="book-outline" size={17} color="#00F2FE" />
              </View>
              <Text style={styles.cardHeaderTitle}>In Simple Words</Text>
            </View>
            <Text style={styles.bodyText}>{data.simpleWords}</Text>
          </View>

          {/* 2. What Is Actually Happening (Detailed Breakdown) */}
          {data.whatIsHappening && data.whatIsHappening.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
                  <Ionicons name="flask-outline" size={17} color="#8B5CF6" />
                </View>
                <Text style={styles.cardHeaderTitle}>What Is Actually Happening</Text>
              </View>

              <View style={styles.frequencyList}>
                {data.whatIsHappening.map((item, idx) => (
                  <View key={`freq_item_${idx}`} style={styles.freqItemBox}>
                    <Text style={styles.freqNameHeader}>{item.freq}</Text>
                    <Text style={styles.freqMeaningText}>{item.meaning}</Text>
                    {item.hearing && (
                      <Text style={styles.freqHearingText}>
                        👂 <Text style={{ fontStyle: 'italic' }}>{item.hearing}</Text>
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 3. Future Impact & Phone Health */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                <Ionicons name="time-outline" size={17} color="#F59E0B" />
              </View>
              <Text style={styles.cardHeaderTitle}>Future Impact on Your Phone</Text>
            </View>
            <Text style={styles.bodyText}>{data.resultImpact}</Text>
          </View>

          {/* 4. Action Recommendation */}
          <View
            style={[
              styles.infoCard,
              {
                borderColor: 'rgba(16, 185, 129, 0.3)',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
              },
            ]}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="bulb-outline" size={17} color="#10B981" />
              </View>
              <Text style={[styles.cardHeaderTitle, { color: '#10B981' }]}>
                What Should You Do?
              </Text>
            </View>
            <Text style={[styles.bodyText, { color: '#E2E8F0' }]}>
              {data.actionRecommendation}
            </Text>
          </View>

          {/* Got It Button */}
          <TouchableOpacity
            style={styles.gotItButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={20} color="#070B14" style={{ marginRight: 8 }} />
            <Text style={styles.gotItText}>Got It, Thanks!</Text>
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
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  heroTitleCard: {
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    marginBottom: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topicMainTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  infoCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardHeaderIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  bodyText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
  },
  frequencyList: {
    gap: 8,
    marginTop: 4,
  },
  freqItemBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  freqNameHeader: {
    color: '#00F2FE',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  freqMeaningText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
  },
  freqHearingText: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginTop: 4,
  },
  gotItButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00F2FE',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  gotItText: {
    color: '#070B14',
    fontSize: 14.5,
    fontWeight: '800',
  },
});

