import { useState, useEffect, useCallback } from 'react';
import * as Network from 'expo-network';

/**
 * Custom hook to track real-time network states and local IP address.
 * Automatically subscribes to connection events and provides manual refresh.
 */
export function useNetworkState() {
  const [networkInfo, setNetworkInfo] = useState({
    ipAddress: 'Detecting...',
    connectionType: 'UNKNOWN',
    isConnected: true,
    isInternetReachable: true,
    isAirplaneMode: false,
    loading: true,
  });

  const updateNetworkData = useCallback(async () => {
    try {
      // 1. Fetch Local IP address
      let ip = '0.0.0.0';
      try {
        ip = await Network.getIpAddressAsync();
      } catch (err) {
        console.warn('Could not read IP address:', err);
      }

      // 2. Fetch Active Network State
      let state = {
        type: Network.NetworkStateType.UNKNOWN,
        isConnected: false,
        isInternetReachable: false,
      };
      try {
        state = await Network.getNetworkStateAsync();
      } catch (err) {
        console.warn('Could not read network state:', err);
      }

      // 3. Check Airplane Mode (Android specific)
      let airplaneMode = false;
      try {
        if (typeof Network.isAirplaneModeEnabledAsync === 'function') {
          airplaneMode = await Network.isAirplaneModeEnabledAsync();
        }
      } catch (err) {
        // Airplane mode check might not be available or restricted on certain platforms
      }

      setNetworkInfo({
        ipAddress: ip || 'Unavailable',
        connectionType: state.type || 'UNKNOWN',
        isConnected: !!state.isConnected,
        isInternetReachable: state.isInternetReachable !== undefined ? state.isInternetReachable : true,
        isAirplaneMode: airplaneMode,
        loading: false,
      });
    } catch (e) {
      console.error('Error updating network state:', e);
      setNetworkInfo((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    updateNetworkData();

    // Event listener for network state changes
    let subscription = null;
    try {
      if (typeof Network.addNetworkStateListener === 'function') {
        subscription = Network.addNetworkStateListener((event) => {
          setNetworkInfo((prev) => ({
            ...prev,
            connectionType: event.type || prev.connectionType,
            isConnected: !!event.isConnected,
            isInternetReachable: event.isInternetReachable !== undefined ? event.isInternetReachable : true,
          }));
          // Re-fetch IP when network interface transitions (e.g., cellular <-> wifi)
          updateNetworkData();
        });
      }
    } catch (err) {
      console.warn('Network state listener subscription error:', err);
    }

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [updateNetworkData]);

  return {
    ...networkInfo,
    refreshNetwork: updateNetworkData,
  };
}

