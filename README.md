# Device Sentinel — Hardware Diagnostics & Device Info (Expo SDK 57)

A sleek, privacy-compliant hardware diagnostics and system telemetry mobile app built with React Native and Expo Go. Features a futuristic Dark Mode aesthetic (deep obsidian `#070B14` with luminous Cyan and Teal accents), smooth animated screen transitions, an ergonomic **Floating Bottom Navigation Dock**, and interactive hardware test tools.

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Dashboard (Overview)
- **Device Identity**: Hardware model, brand, Android OS build, and real-time device uptime.
- **4-Box Telemetry Matrix**: Instant glance at RAM memory, live battery %, battery core temperature, active network interface, and storage headroom.
- **Diagnostic Control Center**: Quick action launchers to jump directly to deep-dive screens.
- **Abnormal Drain Alert**: Prominent alert card whenever rapid discharge velocity (>22%/hr) is detected.

### 2. 🔋 Battery & Thermal Analysis
- **Live Battery Percentage & Gauge**: Dynamic fill bar color-coded by remaining level.
- **Power Connection**: Event listeners for `Charging`, `Discharging`, and `Power Saver Mode`.
- **Rolling Mathematical Drain Tracker**:
  - Calculates discharge rate in percentage per hour:
    $$\text{Rate} = \frac{\Delta\text{Level} \times 100}{\Delta t\text{ (in hours)}}$$
  - Flags abnormal rapid drain (>22%/hr) with actionable warnings.
- **Battery Thermal & Temperature Analysis**:
  - Models core battery temperature based on charging state and discharge load.
  - Visual thermal spectrum gauge (Cool ❄️ -> Nominal 🟢 -> Warm 🟡 -> Hot/Throttle Risk 🔴).
  - Celsius (°C) and Fahrenheit (°F) toggle.
  - Lithium-ion chemistry preservation advice and thermal simulation triggers.

### 3. 🌐 Network & Connectivity
- **Local IP Address**: Real-time IPv4 network interface IP.
- **Active Interface**: Wi-Fi, Cellular (LTE/5G), Ethernet, or Offline with dynamic icons.
- **Live Ping & Latency Tester**: Measures true roundtrip latency in milliseconds (e.g., `38 ms - Ultra-Fast`).
- **Airplane Mode**: Real-time state detection on Android devices.

### 4. 💻 Hardware & System Specs
- **Processor & Architecture**: Supported CPU instruction sets (e.g., `arm64-v8a`).
- **RAM Memory & JVM Ceiling**: Kernel-level physical RAM capacity alongside Java VM Heap limit (`Device.getMaxMemoryAsync()`).
- **Storage Breakdown**: Dual-tone visual bar displaying used vs. available free disk space.
- **System Platform**: Android Platform API level, brand, model, and OS fingerprint.

### 5. 🧪 Lab & Health Audit
- **Haptic & Vibration Motor Lab**:
  - Tests **Light Tap**, **Medium Pulse**, **Heavy Impact**, **Success Chime**, and **Dual-Pulse Motor Buzz**.
  - **Live Visual Actuator Monitor**: Features expanding sonic ripple rings and dynamic waveform bars confirming tactile pulse dispatch.
- **Real-Time 3-Axis Accelerometer Sensor**:
  - Live $X, Y, Z$ gravity telemetry and interactive digital bubble level horizon.
- **Display Dead Pixel Test**: Full-screen RGBW test canvas to inspect AMOLED/LCD panels for dead pixels or burn-in.
- **System Health Audit**: Prominent 0–100 score scan with subsystem breakdown and contextual recommendations.

### 6. 📋 One-Tap Report Export
- Copies a complete markdown technical report to the clipboard with haptic confirmation and floating toast notification.

---

## 📱 How to Run via Expo Go

1. Start the Expo development server:
   ```powershell
   npx expo start -c
   ```
2. Scan the QR code using your **Expo Go** app on Android.
