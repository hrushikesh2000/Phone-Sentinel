import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  Platform,
  StatusBar as NativeStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Theme Constants
import { COLORS } from './src/styles/theme';

// Custom Hooks for Live Hardware Telemetry
import { useDeviceHardware } from './src/hooks/useDeviceHardware';
import { useNetworkState } from './src/hooks/useNetworkState';
import { useBatteryDiagnostics } from './src/hooks/useBatteryDiagnostics';

// Navigation & Transition Components
import { TopNavBar } from './src/components/TopNavBar';
import { BottomNavBar } from './src/components/BottomNavBar';
import { AnimatedViewTransition } from './src/components/AnimatedViewTransition';
import { ToastNotification } from './src/components/ToastNotification';

// Modular Screen Views
import { DashboardScreen } from './src/screens/DashboardScreen';
import { BatteryTabScreen } from './src/screens/BatteryTabScreen';
import { NetworkStateCard } from './src/components/NetworkStateCard';
import { HardwareSpecsCard } from './src/components/HardwareSpecsCard';
import { LabScreen } from './src/screens/LabScreen';

// Utilities
import { copyDiagnosticReport } from './src/utils/reportGenerator';

/**
 * Device Sentinel — Hardware Diagnostics & Telemetry
 * Modern Obsidian/Cyberpunk Dark Mode with Bottom Dock Navigation,
 * Battery Temperature Analysis, and Haptic Visual Waveform Monitor.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Hardware specifications hook
  const hardware = useDeviceHardware();

  // 2. Real-time network interfaces hook
  const networkInfo = useNetworkState();

  // 3. Battery diagnostics and mathematical drain tracker hook
  const batteryData = useBatteryDiagnostics();

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        hardware.refreshHardware(),
        networkInfo.refreshNetwork(),
        batteryData.refreshBattery(),
      ]);
    } catch (err) {
      console.warn('Error refreshing diagnostics:', err);
    } finally {
      setRefreshing(false);
    }
  }, [hardware, networkInfo, batteryData]);

  // Export report action
  const handleCopyReport = async () => {
    const success = await copyDiagnosticReport({
      hardware,
      networkInfo,
      batteryData,
    });
    if (success) {
      setToastMessage('Technical Report Copied to Clipboard!');
      setToastVisible(true);
    }
  };

  // Render current selected view
  const renderScreenContent = () => {
    switch (activeTab) {
      case 'battery':
        return <BatteryTabScreen batteryData={batteryData} />;
      case 'network':
        return <NetworkStateCard networkInfo={networkInfo} />;
      case 'hardware':
        return <HardwareSpecsCard hardware={hardware} />;
      case 'lab':
        return (
          <LabScreen
            hardware={hardware}
            batteryData={batteryData}
            networkInfo={networkInfo}
          />
        );
      case 'overview':
      default:
        return (
          <DashboardScreen
            hardware={hardware}
            networkInfo={networkInfo}
            batteryData={batteryData}
            onNavigate={(tabId) => setActiveTab(tabId)}
            onCopyReport={handleCopyReport}
          />
        );
    }
  };

  const isCharging = batteryData.batteryState === 2 || batteryData.batteryState === 3;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={COLORS.background} />

      {/* Modern Top Header with Brand, Model & Direct Actions */}
      <TopNavBar
        hardwareModel={hardware.modelName}
        onRefresh={onRefresh}
        isRefreshing={refreshing}
        batteryLevel={batteryData.batteryLevel}
        isCharging={isCharging}
        onCopyReport={handleCopyReport}
      />

      {/* Main Scrollable Canvas */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary, COLORS.secondary]}
            progressBackgroundColor={COLORS.card}
          />
        }
      >
        {/* Animated View Entry Transition on tab switch */}
        <AnimatedViewTransition activeKey={activeTab}>
          {renderScreenContent()}
        </AnimatedViewTransition>

        {/* Global Footer */}
        <View style={styles.footer}>
          <View style={styles.footerBadgeRow}>
            <Ionicons name="shield-checkmark" size={13} color={COLORS.accent} />
            <Text style={styles.footerBadgeText}>DEVICE SENTINEL TELEMETRY</Text>
          </View>
          <Text style={styles.footerText}>
            Privacy-Compliant Hardware Metrics • Expo Go Sandboxed
          </Text>
        </View>
      </ScrollView>

      {/* Ergonomic Floating Bottom Navigation Dock (Replacing Drawer) */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      {/* Floating Feedback Toast */}
      <ToastNotification
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight || 24 : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 47, 77, 0.4)',
    marginTop: 10,
  },
  footerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.25)',
    marginBottom: 6,
  },
  footerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    marginLeft: 5,
    letterSpacing: 0.8,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
