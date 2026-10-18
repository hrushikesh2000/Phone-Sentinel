/**
 * Utility functions for formatting hardware, battery, and system telemetry data.
 */

/**
 * Format raw byte values into human-readable strings (GB, MB, KB).
 * @param {number|null} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes <= 0) {
    return 'N/A';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i < 0 || i >= sizes.length) return `${bytes} B`;

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format uptime in milliseconds into days, hours, minutes.
 * @param {number|null} ms
 * @returns {string}
 */
export function formatUptime(ms) {
  if (!ms || ms <= 0) return 'Just started';

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${totalSeconds % 60}s`;
}

/**
 * Format battery level (0.0 to 1.0) into a readable integer percentage.
 * @param {number|null} level
 * @returns {string}
 */
export function formatBatteryLevel(level) {
  if (level === null || level === undefined || level < 0) {
    return '--%';
  }
  return `${Math.round(level * 100)}%`;
}

/**
 * Format discharge rate in %/hour with descriptive sign.
 * @param {number|null} ratePerHour
 * @returns {string}
 */
export function formatDrainRate(ratePerHour) {
  if (ratePerHour === null || ratePerHour === undefined || isNaN(ratePerHour)) {
    return 'Calibrating...';
  }
  return `${ratePerHour.toFixed(1)}% / hr`;
}

/**
 * Format timestamp into HH:MM:SS format
 * @param {number|Date} date
 * @returns {string}
 */
export function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

