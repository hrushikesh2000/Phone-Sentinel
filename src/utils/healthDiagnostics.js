/**
 * Smart System Health Diagnostic Engine
 * Analyzes device hardware specs, available RAM capacity, active battery metrics,
 * storage status, and network connection to compute a 0-100 system health score
 * and actionable contextual recommendations.
 */

export function analyzeSystemHealth({
  totalMemoryBytes,
  maxMemoryBytes,
  totalStorageBytes,
  freeStorageBytes,
  batteryLevel, // 0.0 to 1.0
  isCharging,
  drainRatePerHour,
  isDrainAbnormal,
  networkState,
}) {
  const issues = [];
  const recommendations = [];

  // ================= 1. Memory Health (30% weight) =================
  let memoryScore = 100;
  const totalMemoryGB = totalMemoryBytes ? totalMemoryBytes / (1024 ** 3) : 4;

  if (totalMemoryGB >= 6) {
    memoryScore = 100;
  } else if (totalMemoryGB >= 4) {
    memoryScore = 88;
  } else if (totalMemoryGB >= 3) {
    memoryScore = 75;
    issues.push('Moderate RAM capacity (3-4 GB)');
    recommendations.push('Keep background multitasking light to maintain smooth UI responsiveness.');
  } else {
    memoryScore = 60;
    issues.push('Constrained RAM capacity (< 3 GB)');
    recommendations.push('RAM headroom is tight; close unused apps to release physical memory.');
  }

  // ================= 2. Battery & Power Health (35% weight) =================
  let batteryScore = 100;
  const batteryPct = batteryLevel !== null && batteryLevel !== undefined ? batteryLevel * 100 : 80;

  if (isDrainAbnormal) {
    batteryScore -= 35;
    issues.push(`Abnormal rapid discharge rate (${drainRatePerHour ? drainRatePerHour.toFixed(1) : '>25'}%/hr)`);
    recommendations.push('Abnormal battery drain detected! Identify rogue background apps or dim screen brightness.');
  } else if (drainRatePerHour && drainRatePerHour > 18 && !isCharging) {
    batteryScore -= 15;
    issues.push('High battery consumption rate');
    recommendations.push('Active power consumption is elevated; check media streaming or GPS services.');
  }

  if (batteryPct < 15) {
    batteryScore -= 30;
    issues.push('Critical battery reserve (< 15%)');
    recommendations.push('Connect device to charger immediately or toggle Battery Saver mode.');
  } else if (batteryPct < 25) {
    batteryScore -= 15;
    issues.push('Low battery (< 25%)');
    recommendations.push('Battery level is low; consider plugging in soon.');
  } else if (isCharging) {
    batteryScore = Math.min(100, batteryScore + 5);
  }

  batteryScore = Math.max(20, Math.min(100, batteryScore));

  // ================= 3. Storage Health (20% weight) =================
  let storageScore = 100;
  if (totalStorageBytes && freeStorageBytes) {
    const freeRatio = freeStorageBytes / totalStorageBytes;
    const freePercentage = freeRatio * 100;

    if (freePercentage >= 20) {
      storageScore = 100;
    } else if (freePercentage >= 10) {
      storageScore = 85;
      recommendations.push('Storage is reaching capacity; consider archiving old media files.');
    } else {
      storageScore = 55;
      issues.push(`Low disk space (${freePercentage.toFixed(1)}% remaining)`);
      recommendations.push('Internal storage is critically low; clear cache to prevent Android I/O bottlenecks.');
    }
  }

  // ================= 4. Connectivity Health (15% weight) =================
  let networkScore = 100;
  if (networkState) {
    if (networkState.isConnected && networkState.isInternetReachable !== false) {
      networkScore = 100;
    } else if (networkState.isConnected && networkState.isInternetReachable === false) {
      networkScore = 70;
      issues.push('Connected to network, but internet unreachable');
      recommendations.push('Verify gateway internet access or reconnect to your Wi-Fi network.');
    } else {
      networkScore = 60;
      issues.push('Device is offline');
      recommendations.push('Device has no active network link. Turn on Wi-Fi or Mobile Data.');
    }
  }

  // ================= Composite Overall Score =================
  const overallScore = Math.round(
    memoryScore * 0.30 +
    batteryScore * 0.35 +
    storageScore * 0.20 +
    networkScore * 0.15
  );

  // Status Title & Verdict
  let status = 'Excellent';
  let badgeColor = '#10B981'; // Emerald
  let mainHeadline = 'System healthy and operational.';

  if (overallScore >= 88) {
    status = 'Optimal';
    badgeColor = '#00F2FE'; // Cyan
    mainHeadline = 'System healthy. Hardware performance and telemetry are operating within nominal thresholds.';
  } else if (overallScore >= 75) {
    status = 'Good';
    badgeColor = '#10B981'; // Green
    mainHeadline = 'System in good standing with standard background resource utilization.';
  } else if (overallScore >= 60) {
    status = 'Fair';
    badgeColor = '#F59E0B'; // Amber
    mainHeadline = 'Moderate resource load detected. Review highlighted telemetry items below.';
  } else {
    status = 'Attention Needed';
    badgeColor = '#F43F5E'; // Red
    mainHeadline = 'System under heavy load or low power. Action recommended to restore balance.';
  }

  if (recommendations.length === 0) {
    recommendations.push('All core telemetry parameters (RAM, Battery, Storage, Network) are running optimally.');
  }

  return {
    score: overallScore,
    status,
    badgeColor,
    mainHeadline,
    issues,
    recommendations,
    breakdown: {
      memory: { score: memoryScore, title: 'Memory (RAM)' },
      battery: { score: batteryScore, title: 'Power & Battery' },
      storage: { score: storageScore, title: 'Storage Capacity' },
      network: { score: networkScore, title: 'Network State' },
    },
    analyzedAt: new Date().toISOString(),
  };
}

