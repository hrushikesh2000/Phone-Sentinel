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
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Theme Context & Provider
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Custom Hooks for Live Hardware Telemetry
import { useDeviceHardware } from './src/hooks/useDeviceHardware';
import { useNetworkState } from './src/hooks/useNetworkState';
import { useBatteryDiagnostics } from './src/hooks/useBatteryDiagnostics';

// Navigation & Transition Components
import { TopNavBar } from './src/components/TopNavBar';
import { BottomNavBar } from './src/components/BottomNavBar';
import { AnimatedViewTransition } from './src/components/AnimatedViewTransition';
import { ToastNotification } from './src/components/ToastNotification';
import { PrivacyComplianceModal } from './src/components/PrivacyComplianceModal';

// Modular Screen Views
import { DashboardScreen } from './src/screens/DashboardScreen';
import { BatteryTabScreen } from './src/screens/BatteryTabScreen';
import { NetworkStateCard } from './src/components/NetworkStateCard';
import { HardwareSpecsCard } from './src/components/HardwareSpecsCard';
import { LabScreen } from './src/screens/LabScreen';

// Utilities
import { copyDiagnosticReport } from './src/utils/reportGenerator';

function MainApp() {
  const { theme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

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
      setToastMessage('Technical Specs Copied to Clipboard ✨');
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBar} backgroundColor={theme.background} />

      {/* Modern Top Header with Brand, Model & Theme Switcher */}
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
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary, theme.secondary]}
            progressBackgroundColor={theme.card}
          />
        }
      >
        {/* Animated View Entry Transition on tab switch */}
        <AnimatedViewTransition activeKey={activeTab}>
          {renderScreenContent()}
        </AnimatedViewTransition>

        {/* Global Footer */}
        <View style={[styles.footer, { borderTopColor: theme.divider }]}>
          <TouchableOpacity
            style={[
              styles.footerBadgeRow,
              {
                backgroundColor: theme.primaryLight,
                borderColor: `${theme.primary}33`,
              },
            ]}
            onPress={() => setPrivacyModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark" size={13} color={theme.primary} />
            <Text style={[styles.footerBadgeText, { color: theme.primary }]}>
              PRIVACY & DATA SAFETY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPrivacyModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              100% On-Device Diagnostics • DPDP Act & Google Play Compliant
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Ergonomic Floating Bottom Navigation Dock */}
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

      {/* In-App Privacy & DPDP Compliance Modal */}
      <PrivacyComplianceModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />
    </SafeAreaView>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Diagnostics ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#070B14',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <Ionicons
            name="warning-outline"
            size={48}
            color="#EF4444"
            style={{ marginBottom: 16 }}
          />
          <Text
            style={{
              color: '#F8FAFC',
              fontSize: 18,
              fontWeight: '800',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Diagnostics Notice
          </Text>
          <Text
            style={{
              color: '#94A3B8',
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 18,
            }}
          >
            {this.state.error?.message || 'A module encountered an unexpected condition.'}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#00F2FE',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
            }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ color: '#070B14', fontWeight: '800', fontSize: 14 }}>
              Reload Diagnostics
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <MainApp />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight || 24 : 0,
  },
  scrollView: {
    flex: 1,
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
    marginTop: 8,
  },
  footerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  footerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 5,
    letterSpacing: 0.8,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
