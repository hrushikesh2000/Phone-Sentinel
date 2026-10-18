import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionCard } from './SectionCard';
import { StatBadge } from './StatBadge';
import { COLORS } from '../styles/theme';
import { analyzeSystemHealth } from '../utils/healthDiagnostics';

export function HealthCheckCard({ hardware, batteryData, networkInfo }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const runHealthScan = () => {
    setIsScanning(true);
    setScanStep('Auditing RAM capacity & JVM allocation...');

    setTimeout(() => {
      setScanStep('Evaluating battery discharge rate & telemetry...');
    }, 450);

    setTimeout(() => {
      setScanStep('Verifying storage headroom & network interface...');
    }, 900);

    setTimeout(() => {
      // Execute the algorithmic analysis
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

      setDiagnosticResult(result);
      setIsScanning(false);
      setScanStep('');
    }, 1400);
  };

  return (
    <SectionCard
      icon="pulse-outline"
      iconColor={COLORS.primary}
      title="Smart Health Check"
      subtitle="Comprehensive multi-vector system diagnostic"
      accentColor={COLORS.primary}
      badge={<StatBadge label="HEALTH AUDIT" variant="cyan" size="small" />}
    >
      {/* Prominent Scan Action Button */}
      <TouchableOpacity
        style={[styles.scanButton, isScanning && styles.scanButtonActive]}
        onPress={runHealthScan}
        disabled={isScanning}
        activeOpacity={0.85}
      >
        {isScanning ? (
          <View style={styles.scanningContent}>
            <ActivityIndicator size="small" color="#090D16" style={styles.spinner} />
            <View>
              <Text style={styles.scanButtonTextActive}>SCANNING HARDWARE...</Text>
              <Text style={styles.scanStepSubtext}>{scanStep}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.buttonInner}>
            <Ionicons name="shield-checkmark" size={22} color="#090D16" style={styles.btnIcon} />
            <Text style={styles.scanButtonText}>
              {diagnosticResult ? 'Re-Scan System Health' : 'Scan System Health'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Diagnostics Result Card */}
      {diagnosticResult && (
        <View style={styles.resultContainer}>
          {/* Top Score Banner */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreNumber, { color: diagnosticResult.badgeColor }]}>
                {diagnosticResult.score}
              </Text>
              <Text style={styles.scoreOutOf}>/ 100</Text>
            </View>

            <View style={styles.verdictContainer}>
              <View style={styles.verdictBadgeRow}>
                <StatBadge
                  label={diagnosticResult.status}
                  variant={
                    diagnosticResult.score >= 85
                      ? 'cyan'
                      : diagnosticResult.score >= 70
                      ? 'success'
                      : diagnosticResult.score >= 50
                      ? 'warning'
                      : 'danger'
                  }
                />
              </View>
              <Text style={styles.mainHeadline}>{diagnosticResult.mainHeadline}</Text>
            </View>
          </View>

          {/* Subsystem Score Breakdown */}
          <View style={styles.breakdownGrid}>
            {Object.entries(diagnosticResult.breakdown).map(([key, item]) => (
              <View key={key} style={styles.breakdownCard}>
                <Text style={styles.breakdownTitle}>{item.title}</Text>
                <View style={styles.breakdownProgressTrack}>
                  <View
                    style={[
                      styles.breakdownProgressFill,
                      {
                        width: `${item.score}%`,
                        backgroundColor:
                          item.score >= 85
                            ? COLORS.primary
                            : item.score >= 70
                            ? COLORS.success
                            : item.score >= 50
                            ? COLORS.warning
                            : COLORS.danger,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.breakdownScoreText}>{item.score} / 100</Text>
              </View>
            ))}
          </View>

          {/* Contextual Recommendations */}
          <View style={styles.recommendationsBox}>
            <View style={styles.recHeaderRow}>
              <Ionicons name="information-circle" size={18} color={COLORS.secondary} />
              <Text style={styles.recHeaderTitle}>Contextual System Recommendations</Text>
            </View>

            {diagnosticResult.recommendations.map((rec, idx) => (
              <View key={idx} style={styles.recItem}>
                <Ionicons
                  name="chevron-forward-circle"
                  size={15}
                  color={diagnosticResult.score >= 75 ? COLORS.accent : COLORS.warning}
                  style={styles.bulletIcon}
                />
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))}

            {diagnosticResult.issues.length > 0 && (
              <View style={styles.issuesBox}>
                <Text style={styles.issuesHeader}>Detected Telemetry Flags:</Text>
                {diagnosticResult.issues.map((issue, idx) => (
                  <Text key={idx} style={styles.issueText}>
                    • {issue}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  scanButtonActive: {
    backgroundColor: '#38BDF8',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: '#090D16',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scanningContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 10,
  },
  scanButtonTextActive: {
    color: '#090D16',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scanStepSubtext: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  resultContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  scoreCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 2.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
  },
  scoreOutOf: {
    fontSize: 10,
    color: COLORS.textMuted,
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
    color: COLORS.textPrimary,
    fontWeight: '600',
    lineHeight: 18,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  breakdownCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.35)',
  },
  breakdownTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  breakdownProgressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    marginVertical: 6,
    overflow: 'hidden',
  },
  breakdownProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  breakdownScoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  recommendationsBox: {
    marginTop: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textHighlight,
    marginLeft: 6,
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
    color: COLORS.textPrimary,
    lineHeight: 17,
    flex: 1,
  },
  issuesBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.3)',
  },
  issuesHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warning,
    marginBottom: 4,
  },
  issueText: {
    fontSize: 11,
    color: '#FDE68A',
    lineHeight: 16,
  },
});

