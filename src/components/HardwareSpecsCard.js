import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SectionCard } from './SectionCard';
import { InfoRow } from './InfoRow';
import { StatBadge } from './StatBadge';
import { useTheme } from '../context/ThemeContext';
import { formatBytes, formatUptime } from '../utils/formatters';

export function HardwareSpecsCard({ hardware }) {
  const { theme } = useTheme();

  const {
    brand,
    manufacturer,
    modelName,
    osName,
    osVersion,
    platformApiLevel,
    totalMemory,
    maxMemory,
    totalStorage,
    freeStorage,
    supportedCpuArchitectures,
    uptime,
  } = hardware;

  // Compute storage utilization
  let storagePercentUsed = 0;
  let usedStorageBytes = 0;
  if (totalStorage && freeStorage && totalStorage > 0) {
    usedStorageBytes = Math.max(0, totalStorage - freeStorage);
    storagePercentUsed = Math.min(100, Math.round((usedStorageBytes / totalStorage) * 100));
  }

  // Compute memory formatted
  const formattedRAM = formatBytes(totalMemory, 2);
  const formattedMaxVM = formatBytes(maxMemory, 1);
  const formattedTotalStorage = formatBytes(totalStorage, 1);
  const formattedFreeStorage = formatBytes(freeStorage, 1);
  const formattedUsedStorage = formatBytes(usedStorageBytes, 1);

  return (
    <SectionCard
      icon="hardware-chip-outline"
      iconColor={theme.primary}
      title="Hardware & Specs"
      subtitle="Device identity, memory capacity & processor"
      badge={<StatBadge label="Hardware" variant="primary" size="small" />}
    >
      {/* Device Brand & Model */}
      <InfoRow
        label="Brand"
        value={brand ? brand.toUpperCase() : 'UNKNOWN'}
        subvalue={manufacturer && manufacturer !== brand ? `Mfr: ${manufacturer}` : null}
      />

      <InfoRow
        label="Model"
        value={modelName || 'Mobile Terminal'}
        highlight
      />

      {/* Operating System */}
      <InfoRow
        label="Operating System"
        value={`${osName || 'Android'} ${osVersion || ''}`}
        subvalue={platformApiLevel ? `Android API Level: ${platformApiLevel}` : null}
      />

      {/* Total RAM capacity */}
      <InfoRow
        label="Total RAM Capacity"
        value={formattedRAM}
        highlight
        subvalue={maxMemory ? `JVM Heap Limit: ${formattedMaxVM}` : 'Physical Memory'}
      />

      {/* Storage Capacity Visual Bar */}
      {totalStorage ? (
        <View style={[styles.storageSection, { borderBottomColor: theme.divider }]}>
          <View style={styles.storageHeader}>
            <Text style={[styles.storageLabel, { color: theme.textSecondary }]}>Internal Storage</Text>
            <Text style={[styles.storageUsageText, { color: theme.textPrimary }]}>
              {formattedUsedStorage} / {formattedTotalStorage} ({storagePercentUsed}%)
            </Text>
          </View>

          {/* Smooth Soft Storage Bar */}
          <View style={[styles.storageTrack, { backgroundColor: theme.trackBg }]}>
            <View
              style={[
                styles.storageFill,
                {
                  width: `${storagePercentUsed}%`,
                  backgroundColor:
                    storagePercentUsed > 90
                      ? theme.danger
                      : storagePercentUsed > 75
                      ? theme.warning
                      : theme.accent,
                },
              ]}
            />
          </View>

          <View style={styles.storageFooter}>
            <Text style={[styles.storageFooterText, { color: theme.textMuted }]}>
              Free Space: {formattedFreeStorage}
            </Text>
            <Text style={[styles.storageFooterText, { color: theme.textMuted }]}>
              {storagePercentUsed > 90 ? 'Low Storage Warning' : 'Healthy Headroom'}
            </Text>
          </View>
        </View>
      ) : (
        <InfoRow
          label="Internal Storage"
          value="Standard Unified Flash"
          subvalue="Managed by Android OS"
        />
      )}

      {/* CPU Architectures */}
      {supportedCpuArchitectures && supportedCpuArchitectures.length > 0 && (
        <InfoRow
          label="Processor Architecture"
          value={supportedCpuArchitectures.slice(0, 2).join(', ')}
        />
      )}

      {/* System Uptime */}
      <InfoRow
        label="System Uptime"
        value={formatUptime(uptime)}
        isLast
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  storageSection: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  storageUsageText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  storageTrack: {
    height: 9,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 5,
  },
  storageFill: {
    height: '100%',
    borderRadius: 6,
  },
  storageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  storageFooterText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
