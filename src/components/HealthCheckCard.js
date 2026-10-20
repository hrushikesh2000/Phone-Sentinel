import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SectionCard } from './SectionCard';
import { StatBadge } from './StatBadge';
import { ExplainerModal } from './ExplainerModal';
import { useTheme } from '../context/ThemeContext';
import { analyzeSystemHealth } from '../utils/healthDiagnostics';

export function HealthCheckCard({ hardware, batteryData, networkInfo }) {
  const { theme, isDark } = useTheme();

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [explainerVisible, setExplainerVisible] = useState(false);

  const runHealthScan = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}

    setIsScanning(true);
    setScanStep('Auditing RAM headroom & memory...');

    setTimeout(() => {
      setScanStep('Analyzing battery thermal balance & load...');
    }, 450);

    setTimeout(() => {
      setScanStep('Verifying storage space & network stability...');
    }, 900);

    setTimeout(() => {
      const result = analyzeSystemHealth({
        totalMemoryBytes: hardware.totalMemory,
        maxMemoryBytes: hardware.maxMemory,
        totalStorageBytes: hardware.totalStorage,
        freeStorageBytes: hardware.freeStorage,
        batteryLevel: batteryData.batteryLevel,
        isCharging:
          batteryData.batteryState === 2 || batteryData.batteryState === 3,
        drainRatePerHour: batteryData.drainRatePerHour,
        isDrainAbnormal: batteryData.isDrainAbnormal,
        networkState: {
          isConnected: networkInfo.isConnected,
          isInternetReachable: networkInfo.isInternetReachable,
        },
      });

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}

      setDiagnosticResult(result);
      setIsScanning(false);
      setScanStep('');
    }, 1400);
  };

  return (
    <SectionCard
      icon="shield-checkmark-outline"
      iconColor={theme.primary}
      title="System Health Audit"
      subtitle="Comprehensive performance & diagnostic analysis"
      badge={<StatBadge label="Diagnostic" variant="primary" size="small" />}
      onHelpPress={() => setExplainerVisible(true)}
    >
      {/* Prominent Scan Action Button */}
      <TouchableOpacity
        style={[
          styles.scanButton,
          {
            backgroundColor: theme.primary,
          },
        ]}
        onPress={runHealthScan}
        disabled={isScanning}
        activeOpacity={0.85}
      >
        {isScanning ? (
          <View style={styles.scanningContent}>
            <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />
            <View>
              <Text style={styles.scanButtonTextActive}>RUNNING HEALTH AUDIT...</Text>
              <Text style={styles.scanStepSubtext}>{scanStep}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.buttonInner}>
            <Ionicons name="sparkles" size={20} color="#FFFFFF" style={styles.btnIcon} />
            <Text style={styles.scanButtonText}>
              {diagnosticResult ? 'Re-Run System Audit' : 'Scan System Health'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Diagnostics Result Card */}
      {diagnosticResult && (
        <View style={[styles.resultContainer, { borderTopColor: theme.divider }]}>
          {/* Top Score Banner */}
          <View
            style={[
              styles.scoreRow,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View
              style={[
                styles.scoreCircle,
                {
                  backgroundColor: theme.card,
                  borderColor: diagnosticResult.badgeColor,
                },
              ]}
            >
              <Text style={[styles.scoreNumber, { color: diagnosticResult.badgeColor }]}>
                {diagnosticResult.score}
              </Text>
              <Text style={[styles.scoreOutOf, { color: theme.textMuted }]}>/ 100</Text>
            </View>

            <View style={styles.verdictContainer}>
              <View style={styles.verdictBadgeRow}>
                <StatBadge
                  label={diagnosticResult.status}
                  variant={
                    diagnosticResult.score >= 85
                      ? 'primary'
                      : diagnosticResult.score >= 70
                      ? 'success'
                      : diagnosticResult.score >= 50
                      ? 'warning'
                      : 'danger'
                  }
                />
              </View>
              <Text style={[styles.mainHeadline, { color: theme.textPrimary }]}>
                {diagnosticResult.mainHeadline}
              </Text>
            </View>
          </View>

          {/* Subsystem Score Breakdown */}
          <View style={styles.breakdownGrid}>
            {Object.entries(diagnosticResult.breakdown).map(([key, item]) => (
              <View
                key={key}
                style={[
                  styles.breakdownCard,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.breakdownTitle, { color: theme.textSecondary }]}>
                  {item.title}
                </Text>
                <View style={[styles.breakdownProgressTrack, { backgroundColor: theme.trackBg }]}>
                  <View
                    style={[
                      styles.breakdownProgressFill,
                      {
                        width: `${item.score}%`,
                        backgroundColor:
                          item.score >= 85
                            ? theme.primary
                            : item.score >= 70
                            ? theme.success
                            : item.score >= 50
                            ? theme.warning
                            : theme.danger,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.breakdownScoreText, { color: theme.textPrimary }]}>
                  {item.score} / 100
                </Text>
              </View>
            ))}
          </View>

          {/* Contextual Recommendations */}
          <View
            style={[
              styles.recommendationsBox,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View style={styles.recHeaderRow}>
              <Ionicons name="bulb-outline" size={18} color={theme.primary} />
              <Text style={[styles.recHeaderTitle, { color: theme.textPrimary }]}>
                Actionable System Insights
              </Text>
            </View>

            {diagnosticResult.recommendations.map((rec, idx) => (
              <View key={idx} style={styles.recItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={diagnosticResult.score >= 75 ? theme.success : theme.warning}
                  style={styles.bulletIcon}
                />
                <Text style={[styles.recText, { color: theme.textSecondary }]}>{rec}</Text>
              </View>
            ))}

            {diagnosticResult.issues.length > 0 && (
              <View style={[styles.issuesBox, { borderTopColor: theme.divider }]}>
                <Text style={[styles.issuesHeader, { color: theme.warning }]}>
                  Items to note:
                </Text>
                {diagnosticResult.issues.map((issue, idx) => (
                  <Text key={idx} style={[styles.issueText, { color: theme.textSecondary }]}>
                    • {issue}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Plain-English Audit Explainer */}
      <ExplainerModal
        visible={explainerVisible}
        topicKey="system_health_audit"
        onClose={() => setExplainerVisible(false)}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  scanningContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 10,
  },
  scanButtonTextActive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scanStepSubtext: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  resultContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 26,
  },
  scoreOutOf: {
    fontSize: 10,
    fontWeight: '700',
  },
  verdictContainer: {
    flex: 1,
  },
  verdictBadgeRow: {
    marginBottom: 4,
  },
  mainHeadline: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  breakdownCard: {
    flex: 1,
    minWidth: '46%',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  breakdownTitle: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  breakdownProgressTrack: {
    height: 6,
    borderRadius: 4,
    marginVertical: 6,
    overflow: 'hidden',
  },
  breakdownProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownScoreText: {
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'right',
  },
  recommendationsBox: {
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginLeft: 7,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  recText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  issuesBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  issuesHeader: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  issueText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
});
