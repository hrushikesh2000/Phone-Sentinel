import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { Paths } from 'expo-file-system';

/**
 * Custom hook to collect privacy-compliant hardware specifications
 * Runs 100% inside Expo Go without requiring privileged native identifiers (no IMEI / MAC).
 */
export function useDeviceHardware() {
  const [hardware, setHardware] = useState({
    brand: Device.brand || (Platform.OS === 'android' ? 'Android Device' : 'Apple Device'),
    manufacturer: Device.manufacturer || 'Unknown',
    modelName: Device.modelName || Device.productName || Device.designName || 'Mobile Terminal',
    productName: Device.productName || 'N/A',
    osName: Device.osName || Platform.OS,
    osVersion: Device.osVersion || 'Unknown',
    platformApiLevel: Device.platformApiLevel || null,
    totalMemory: Device.totalMemory || null, // in bytes
    maxMemory: null,
    uptime: null,
    deviceYearClass: Device.deviceYearClass || null,
    isDevice: Device.isDevice,
    supportedCpuArchitectures: Device.supportedCpuArchitectures || [],
    deviceType: Device.deviceType,
    // Storage metrics
    totalStorage: null,
    freeStorage: null,
    loading: true,
  });

  const fetchHardwareData = useCallback(async () => {
    try {
      // 1. Fetch async memory & uptime data
      let maxMem = null;
      let uptimeMs = null;

      try {
        if (typeof Device.getMaxMemoryAsync === 'function') {
          maxMem = await Device.getMaxMemoryAsync();
        }
      } catch (err) {
        console.warn('Could not read max memory:', err);
      }

      try {
        if (typeof Device.getUptimeAsync === 'function') {
          uptimeMs = await Device.getUptimeAsync();
        }
      } catch (err) {
        console.warn('Could not read uptime:', err);
      }

      // 2. Fetch Storage capacity via Paths (expo-file-system)
      let totalDisk = null;
      let availableDisk = null;

      try {
        if (Paths && typeof Paths.totalDiskSpace === 'number') {
          totalDisk = Paths.totalDiskSpace;
          availableDisk = Paths.availableDiskSpace;
        }
      } catch (err) {
        console.warn('Could not read storage metrics from Paths:', err);
      }

      setHardware((prev) => ({
        ...prev,
        brand: Device.brand || prev.brand,
        manufacturer: Device.manufacturer || prev.manufacturer,
        modelName: Device.modelName || Device.productName || Device.designName || prev.modelName,
        productName: Device.productName || prev.productName,
        osName: Device.osName || Platform.OS,
        osVersion: Device.osVersion || prev.osVersion,
        platformApiLevel: Device.platformApiLevel,
        totalMemory: Device.totalMemory,
        maxMemory: maxMem,
        uptime: uptimeMs,
        totalStorage: totalDisk,
        freeStorage: availableDisk,
        loading: false,
      }));
    } catch (e) {
      console.error('Error fetching hardware info:', e);
      setHardware((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchHardwareData();
  }, [fetchHardwareData]);

  return {
    ...hardware,
    refreshHardware: fetchHardwareData,
  };
}

