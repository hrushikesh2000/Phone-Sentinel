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

export function PrivacyComplianceModal({ visible, onClose }) {
  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
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
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.headerTitle}>Privacy & Regulatory Compliance</Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              triggerHaptic();
              onClose();
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero Compliance Seal */}
          <View style={styles.sealCard}>
            <View style={styles.sealIconWrap}>
              <Ionicons name="lock-closed" size={32} color="#10B981" />
            </View>
            <Text style={styles.sealTitle}>100% On-Device & Zero Data Collection</Text>
            <Text style={styles.sealDesc}>
              Device Sentinel is engineered with a strict privacy-first architecture. All diagnostic metrics, sensor readings, and hardware specs are processed ephemerally on your device and are never sent to external servers.
            </Text>
          </View>

          {/* Section 1: Google Play Store Compliance */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="logo-google-playstore" size={20} color="#00F2FE" />
              <Text style={styles.sectionTitle}>Google Play Policy Compliance</Text>
            </View>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <View style={styles.ruleTextWrap}>
                <Text style={styles.ruleTitle}>Data Safety Section</Text>
                <Text style={styles.ruleDesc}>
                  Zero user data collected, stored, or shared with third parties.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <View style={styles.ruleTextWrap}>
                <Text style={styles.ruleTitle}>Minimal Permissions</Text>
                <Text style={styles.ruleDesc}>
                  Only standard non-sensitive permissions requested (Internet for ping latency check, Network state, and Actuator vibration). No location, camera, or contact access.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <View style={styles.ruleTextWrap}>
                <Text style={styles.ruleTitle}>Target API 35 Ready</Text>
                <Text style={styles.ruleDesc}>
                  Built with Expo SDK 57 adhering to modern Google Play target API requirements.
                </Text>
              </View>
            </View>
          </View>

          {/* Section 2: Government of India Compliance */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flag-outline" size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Government of India Regulations</Text>
            </View>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <View style={styles.ruleTextWrap}>
                <Text style={styles.ruleTitle}>DPDP Act, 2023</Text>
                <Text style={styles.ruleDesc}>
                  Complies with the Digital Personal Data Protection Act, 2023. No Personally Identifiable Information (PII) is processed or retained.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <View style={styles.ruleTextWrap}>
                <Text style={styles.ruleTitle}>IT Rules, 2021 & IT Act, 2000</Text>
                <Text style={styles.ruleDesc}>
                  Fully adheres to reasonable security practices under Section 43A of the IT Act.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <View style={styles.ruleTextWrap}>
                <Text style={styles.ruleTitle}>CERT-In Directions</Text>
                <Text style={styles.ruleDesc}>
                  Zero backdoors, zero telemetry spyware, and no unauthorized exfiltration routines.
                </Text>
              </View>
            </View>
          </View>

          {/* Section 3: Grievance Redressal Officer */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle-outline" size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Grievance Officer (IT Rules, 2021)</Text>
            </View>

            <Text style={styles.grievanceText}>
              In accordance with Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021:
            </Text>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Officer:</Text>
              <Text style={styles.contactValue}>Paluru Hrushikesh</Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Contact Email:</Text>
              <Text style={styles.contactValue}>hkdk2000@gmail.com</Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Jurisdiction:</Text>
              <Text style={styles.contactValue}>Andhra Pradesh / India</Text>
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Response SLA:</Text>
              <Text style={styles.contactValue}>Within 24 Hours</Text>
            </View>
          </View>
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
    paddingBottom: 32,
  },
  sealCard: {
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 16,
  },
  sealIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sealTitle: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  sealDesc: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  sectionCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  ruleTextWrap: {
    flex: 1,
  },
  ruleTitle: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  ruleDesc: {
    color: '#94A3B8',
    fontSize: 11.5,
    lineHeight: 16,
  },
  grievanceText: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginBottom: 10,
    lineHeight: 16,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  contactLabel: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '600',
  },
  contactValue: {
    color: '#00F2FE',
    fontSize: 11.5,
    fontWeight: '700',
  },
});

