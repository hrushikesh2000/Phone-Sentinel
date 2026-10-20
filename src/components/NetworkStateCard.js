import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SectionCard } from './SectionCard';
import { InfoRow } from './InfoRow';
import { StatBadge } from './StatBadge';
import { ExplainerModal } from './ExplainerModal';
import { useTheme } from '../context/ThemeContext';
import { measureNetworkPing } from '../utils/networkPing';

export function NetworkStateCard({ networkInfo }) {
  const { theme, isDark } = useTheme();

  const {
    ipAddress,
    connectionType,
    isConnected,
    isInternetReachable,
    isAirplaneMode,
  } = networkInfo;

  const [pingResult, setPingResult] = useState(null);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [explainerVisible, setExplainerVisible] = useState(false);

  const handleTestPing = async () => {
    setIsTestingPing(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}

    const res = await measureNetworkPing();
    setPingResult(res);
    setIsTestingPing(false);
  };

  // Determine appropriate icon based on network type
  let networkIcon = 'wifi-outline';
  let typeColor = theme.secondary;
  const upperType = (connectionType || '').toUpperCase();

  if (upperType === 'CELLULAR') {
    networkIcon = 'cellular-outline';
    typeColor = theme.accent;
  } else if (upperType === 'WIFI') {
    networkIcon = 'wifi-outline';
    typeColor = theme.primary;
  } else if (upperType === 'ETHERNET') {
    networkIcon = 'git-network-outline';
  } else if (!isConnected || upperType === 'NONE') {
    networkIcon = 'cloud-offline-outline';
    typeColor = theme.danger;
  }

  return (
    <SectionCard
      icon={networkIcon}
      iconColor={typeColor}
      title="Network & Connectivity"
      subtitle="Interface IP, internet gateway & latency"
      badge={<StatBadge label="Network" variant="info" size="small" />}
      onHelpPress={() => setExplainerVisible(true)}
    >
      {/* Network Type Hero Highlight */}
      <View
        style={[
          styles.heroRow,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.heroLeft}>
          <View style={[styles.heroIconBadge, { backgroundColor: `${typeColor}18` }]}>
            <Ionicons name={networkIcon} size={22} color={typeColor} />
          </View>
          <View>
            <Text style={[styles.heroLabel, { color: theme.textMuted }]}>Active Interface</Text>
            <Text style={[styles.heroValue, { color: theme.textPrimary }]}>
              {connectionType ? connectionType.toUpperCase() : 'UNKNOWN'}
            </Text>
          </View>
        </View>

        <StatBadge
          label={isConnected ? 'Connected' : 'Offline'}
          variant={isConnected ? 'success' : 'danger'}
          size="small"
        />
      </View>

      {/* Local IP Address */}
      <InfoRow
        label="Local IP Address"
        value={ipAddress || 'Unavailable'}
        highlight
        subvalue="Device IPv4 Interface"
      />

      {/* Internet Reachability */}
      <InfoRow
        label="Internet Gateway"
        value={isInternetReachable ? 'Verified & Online' : isConnected ? 'Local Link Only' : 'Offline'}
        badge={
          <StatBadge
            label={isInternetReachable ? 'Online' : 'Limited'}
            variant={isInternetReachable ? 'success' : 'warning'}
            size="small"
          />
        }
      />

      {/* Airplane Mode status */}
      <InfoRow
        label="Airplane Mode"
        value={isAirplaneMode ? 'Enabled' : 'Disabled'}
        badge={
          <StatBadge
            label={isAirplaneMode ? 'Active' : 'Off'}
            variant={isAirplaneMode ? 'warning' : 'neutral'}
            size="small"
          />
        }
      />

      {/* Live Ping & Latency Tester */}
      <View
        style={[
          styles.pingBox,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.pingHeader}>
          <View style={styles.pingTitleRow}>
            <Ionicons name="pulse" size={17} color={theme.primary} />
            <Text style={[styles.pingTitle, { color: theme.textPrimary }]}>Gateway Latency (Ping)</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.pingTestBtn,
              {
                backgroundColor: theme.primaryLight,
                borderColor: `${theme.primary}44`,
              },
            ]}
            onPress={handleTestPing}
            disabled={isTestingPing || !isConnected}
            activeOpacity={0.7}
          >
            {isTestingPing ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Text style={[styles.pingBtnText, { color: theme.primary }]}>
                {pingResult ? 'Re-Test' : 'Test Latency'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {pingResult ? (
          <View style={[styles.pingResultRow, { borderTopColor: theme.divider }]}>
            <View style={styles.pingMetric}>
              <Text style={[styles.pingNumber, { color: theme.textPrimary }]}>
                {pingResult.latencyMs} ms
              </Text>
              <Text style={[styles.pingSub, { color: theme.textSecondary }]}>
                Roundtrip Response Time
              </Text>
            </View>
            <StatBadge
              label={pingResult.grade}
              variant={pingResult.statusVariant}
              size="small"
            />
          </View>
        ) : (
          <Text style={[styles.pingPrompt, { color: theme.textMuted }]}>
            {isConnected
              ? 'Tap "Test Latency" to measure live roundtrip ping to Google/Cloudflare DNS.'
              : 'Network offline. Connect to Wi-Fi or Cellular to test latency.'}
          </Text>
        )}
      </View>

      {/* Plain-English Network Explainer */}
      <ExplainerModal
        visible={explainerVisible}
        topicKey="network_latency_ping"
        onClose={() => setExplainerVisible(false)}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  heroValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
    letterSpacing: -0.2,
  },
  pingBox: {
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  pingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pingTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginLeft: 7,
  },
  pingTestBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pingBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  pingResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  pingMetric: {
    flex: 1,
  },
  pingNumber: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  pingSub: {
    fontSize: 11.5,
    marginTop: 1,
    fontWeight: '500',
  },
  pingPrompt: {
    fontSize: 11.5,
    marginTop: 8,
    lineHeight: 16,
  },
});
