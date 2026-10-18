import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BatteryDiagnosticsCard } from '../components/BatteryDiagnosticsCard';
import { BatteryThermalCard } from '../components/BatteryThermalCard';

export function BatteryTabScreen({ batteryData }) {
  return (
    <View style={styles.container}>
      {/* 1. Live Battery Telemetry & Rolling Mathematical Drain Tracker */}
      <BatteryDiagnosticsCard batteryData={batteryData} />

      {/* 2. Battery Thermal & Temperature Analysis */}
      <BatteryThermalCard batteryData={batteryData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
});

