import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { formatBytes, formatUptime, formatBatteryLevel } from './formatters';

/**
 * Generate a comprehensive markdown diagnostic report and copy to clipboard.
 */
export async function copyDiagnosticReport({ hardware = {}, networkInfo = {}, batteryData = {}, healthScore } = {}) {
  const report = `# 📱 Device Sentinel — Diagnostics Report
Generated: ${new Date().toLocaleString()}

## 💻 Hardware Identity
- Brand: ${hardware.brand || 'N/A'}
- Model: ${hardware.modelName || 'N/A'}
- Manufacturer: ${hardware.manufacturer || 'N/A'}
- Operating System: ${hardware.osName || 'Android'} ${hardware.osVersion || ''} (API ${hardware.platformApiLevel || 'N/A'})
- CPU Architecture: ${(hardware.supportedCpuArchitectures || []).join(', ') || 'N/A'}
- Physical RAM: ${formatBytes(hardware.totalMemory, 2)}
- JVM Heap Ceiling: ${formatBytes(hardware.maxMemory, 2)}
- Storage: ${formatBytes(hardware.totalStorage, 2)} Total (${formatBytes(hardware.freeStorage, 2)} Free)
- Uptime: ${formatUptime(hardware.uptime)}

## 🌐 Network Interface
- Local IP: ${networkInfo.ipAddress || 'Unavailable'}
- Connection: ${networkInfo.connectionType || 'Unknown'}
- Internet Reachable: ${networkInfo.isInternetReachable ? 'Yes' : 'No'}
- Airplane Mode: ${networkInfo.isAirplaneMode ? 'Active' : 'Disabled'}

## 🔋 Battery Diagnostics
- Battery Level: ${formatBatteryLevel(batteryData.batteryLevel)}
- State: ${batteryData.batteryState === 2 ? 'Charging' : 'Discharging'}
- Low Power Mode: ${batteryData.lowPowerMode ? 'Enabled' : 'Disabled'}
- Discharge Rate: ${batteryData.drainRatePerHour ? batteryData.drainRatePerHour.toFixed(1) + '%/hr' : 'Stable'}
- Drain Anomaly: ${batteryData.isDrainAbnormal ? 'ALERT: Rapid Drain Detected' : 'Nominal'}

## 🛡️ Health Audit Index
- Overall Score: ${healthScore ? healthScore + '/100' : 'Not scanned'}
---
Privacy Compliant • Verified via Expo Go
`;

  try {
    await Clipboard.setStringAsync(report);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Haptics optional fallback
    }
    return true;
  } catch (err) {
    console.warn('Failed to copy report:', err);
    return false;
  }
}

