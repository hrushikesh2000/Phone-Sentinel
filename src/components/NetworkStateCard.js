import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SectionCard } from './SectionCard';
import { InfoRow } from './InfoRow';
import { StatBadge } from './StatBadge';
import { COLORS } from '../styles/theme';
import { measureNetworkPing } from '../utils/networkPing';

export function NetworkStateCard({ networkInfo }) {
  const {
    ipAddress,
    connectionType,
    isConnected,
    isInternetReachable,
    isAirplaneMode,
  } = networkInfo;

  const [pingResult, setPingResult] = useState(null);
  const [isTestingPing, setIsTestingPing] = useState(false);

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
  let typeColor = COLORS.secondary;
  const upperType = (connectionType || '').toUpperCase();

  if (upperType === 'CELLULAR') {
    networkIcon = 'cellular-outline';
    typeColor = COLORS.accent;
  } else if (upperType === 'WIFI') {
    networkIcon = 'wifi-outline';
    typeColor = COLORS.primary;
  } else if (upperType === 'ETHERNET') {
    networkIcon = 'git-network-outline';
  } else if (!isConnected || upperType === 'NONE') {
    networkIcon = 'cloud-offline-outline';
    typeColor = COLORS.danger;
  }

  return (
    <SectionCard
      icon={networkIcon}
      iconColor={typeColor}
      title="Network & Connectivity"
      subtitle="Interface IP, gateway health & ping latency"
      accentColor={COLORS.secondary}
      badge={<StatBadge label="NETWORK" variant="info" size="small" />}
    >
      {/* Network Type Hero Highlight */}
      <View style={styles.heroRow}>
        <View style={styles.heroLeft}>
          <View style={[styles.heroIconBadge, { backgroundColor: `${typeColor}20` }]}>
            <Ionicons name={networkIcon} size={24} color={typeColor} />
          </View>
          <View>
            <Text style={styles.heroLabel}>Active Interface</Text>
            <Text style={[styles.heroValue, { color: typeColor }]}>
              {connectionType ? connectionType.toUpperCase() : 'UNKNOWN'}
            </Text>
          </View>
        </View>

        <StatBadge
          label={isConnected ? 'CONNECTED' : 'DISCONNECTED'}
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
        label="Gateway Status"
        value={isInternetReachable ? 'Internet Reachable' : isConnected ? 'Local Link Only' : 'Offline'}
        badge={
          <StatBadge
            label={isInternetReachable ? 'ONLINE' : 'UNREACHABLE'}
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
            label={isAirplaneMode ? 'ACTIVE' : 'OFF'}
            variant={isAirplaneMode ? 'warning' : 'neutral'}
            size="small"
          />
        }
      />

      {/* Live Ping & Latency Tester */}
      <View style={styles.pingBox}>
        <View style={styles.pingHeader}>
          <View style={styles.pingTitleRow}>
            <Ionicons name="pulse" size={17} color={COLORS.primary} />
            <Text style={styles.pingTitle}>Gateway Latency (Ping)</Text>
          </View>

          <TouchableOpacity
            style={styles.pingTestBtn}
            onPress={handleTestPing}
            disabled={isTestingPing || !isConnected}
            activeOpacity={0.7}
          >
            {isTestingPing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.pingBtnText}>
                {pingResult ? 'Re-Ping' : 'Test Ping'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {pingResult ? (
          <View style={styles.pingResultRow}>
            <View style={styles.pingMetric}>
              <Text style={styles.pingNumber}>{pingResult.latencyMs} ms</Text>
              <Text style={styles.pingSub}>Roundtrip Latency</Text>
            </View>
            <StatBadge
              label={pingResult.grade}
              variant={pingResult.statusVariant}
              size="small"
            />
          </View>
        ) : (
          <Text style={styles.pingPrompt}>
            {isConnected
              ? 'Tap "Test Ping" to measure roundtrip latency to DNS gateway.'
              : 'Network offline. Connect to Wi-Fi or Cellular to test ping.'}
          </Text>
        )}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 1,
    letterSpacing: 0.3,
  },
  pingBox: {
    marginTop: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
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
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  pingTestBtn: {
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pingBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pingResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.3)',
  },
  pingMetric: {
    flex: 1,
  },
  pingNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  pingSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  pingPrompt: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
    lineHeight: 16,
  },
});
