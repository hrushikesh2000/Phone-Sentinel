import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SectionCard } from './SectionCard';
import { InfoRow } from './InfoRow';
import { StatBadge } from './StatBadge';
import { COLORS } from '../styles/theme';
import { formatBytes, formatUptime } from '../utils/formatters';

export function HardwareSpecsCard({ hardware }) {
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
      iconColor={COLORS.primary}
      title="Hardware & System Specs"
      subtitle="Physical device & memory architecture"
      accentColor={COLORS.primary}
      badge={<StatBadge label="HARDWARE" variant="cyan" size="small" />}
    >
      {/* Device Brand & Model */}
      <InfoRow
        label="Device Brand"
        value={brand ? brand.toUpperCase() : 'UNKNOWN'}
        subvalue={manufacturer && manufacturer !== brand ? `Mfr: ${manufacturer}` : null}
      />

      <InfoRow
        label="Device Model"
        value={modelName || 'Standard Mobile'}
        highlight
      />

      {/* Operating System */}
      <InfoRow
        label="Operating System"
        value={`${osName || 'Android'} ${osVersion || ''}`}
        subvalue={platformApiLevel ? `Platform API Level: ${platformApiLevel}` : null}
      />

      {/* Total RAM capacity */}
      <InfoRow
        label="Total RAM Capacity"
        value={formattedRAM}
        highlight
        subvalue={maxMemory ? `JVM Heap Limit: ${formattedMaxVM}` : 'Physical Kernel Memory'}
      />

      {/* Storage Capacity Visual Bar */}
      {totalStorage ? (
        <View style={styles.storageSection}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageLabel}>Internal Storage Capacity</Text>
            <Text style={styles.storageUsageText}>
              {formattedUsedStorage} / {formattedTotalStorage} ({storagePercentUsed}%)
            </Text>
          </View>

          {/* Custom Dual-Tone Storage Bar */}
          <View style={styles.storageTrack}>
            <View
              style={[
                styles.storageFill,
                {
                  width: `${storagePercentUsed}%`,
                  backgroundColor:
                    storagePercentUsed > 90
                      ? COLORS.danger
                      : storagePercentUsed > 75
                      ? COLORS.warning
                      : COLORS.accent,
                },
              ]}
            />
          </View>

          <View style={styles.storageFooter}>
            <Text style={styles.storageFooterText}>Free: {formattedFreeStorage}</Text>
            <Text style={styles.storageFooterText}>
              {storagePercentUsed > 90 ? 'Low Space' : 'Nominal Headroom'}
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
          label="CPU Architecture"
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.35)',
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  storageUsageText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  storageTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    overflow: 'hidden',
    marginVertical: 4,
  },
  storageFill: {
    height: '100%',
    borderRadius: 4,
  },
  storageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  storageFooterText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});

