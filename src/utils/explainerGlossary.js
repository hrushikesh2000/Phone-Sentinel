/**
 * Plain-English Knowledge Base for Phone Sentinel Diagnostics
 * Designed specifically for elderly, non-technical, and curious users.
 */

export const EXPLAINER_GLOSSARY = {
  audio_frequencies: {
    id: 'audio_frequencies',
    title: 'Speaker Frequency Diagnostics',
    badge: 'Audio Health',
    icon: 'volume-high',
    color: '#00F2FE',
    animationType: 'speaker_cone',
    simpleWords:
      'Sound is simply air vibrating. Your phone speaker is a tiny flexible drum (diaphragm) pushed by a magnet. Playing different tones checks if this tiny drum can vibrate slowly for deep bass and ultra-fast for crisp speech without tearing or buzzing.',
    whatIsHappening: [
      {
        freq: '250 Hz (Deep Bass)',
        meaning:
          'The speaker drum moves back and forth slowly (250 times every second). This tests the physical rubber edges and seal of the speaker.',
        hearing: 'Sounds like a low motorized hum or foghorn.',
      },
      {
        freq: '1 kHz (Voice Standard)',
        meaning:
          '1,000 vibrations per second. This is the exact pitch of human vocal cords during regular telephone phone calls.',
        hearing: 'Sounds like a classic dial tone or microwave beep.',
      },
      {
        freq: '4 kHz (High Presence)',
        meaning:
          'Fast vibration (4,000 times per second). Tests speech clarity for consonants like "S", "T", "P", and bird chirps.',
        hearing: 'Sounds like a high electronic whistle.',
      },
      {
        freq: '8 kHz (Treble Limits)',
        meaning:
          'Extreme speed (8,000 vibrations per second). This pushes miniature smartphone speakers to their absolute mechanical limit.',
        hearing: 'Sounds like a very sharp, thin sibilant whine.',
      },
    ],
    resultImpact:
      'If you hear clear tones with no crackling, your speaker drivers and voice coils are in factory-new condition. If you hear a raspy buzz or rattling, water droplets, lint, or blown paper mesh are distorting the sound, which will make phone calls hard to understand.',
    actionRecommendation:
      'If any tone sounds distorted or muffled: (1) Check if the speaker mesh on the bottom or top of your phone has pocket lint; clean it gently with a dry soft toothbrush. (2) If water recently entered, let the phone dry in open air.',
  },

  battery_80_guard: {
    id: 'battery_80_guard',
    title: '80% Battery Longevity Guard',
    badge: 'Battery Lifespan',
    icon: 'shield-checkmark',
    color: '#10B981',
    animationType: 'battery_balloon',
    simpleWords:
      'Think of your smartphone battery like a rubber balloon. Filling it comfortably to 80% keeps the rubber relaxed. Forcing it to 100% every single day stretches the rubber tightly under high electrical pressure, wearing it out twice as fast.',
    whatIsHappening: [
      {
        freq: 'Chemical Tension',
        meaning:
          'Between 0% and 80%, lithium-ion batteries charge smoothly with low heat. Above 80%, internal electrical voltage spikes, generating internal micro-heat.',
        hearing: 'Modern electric cars and flagship smartphones use this exact 80% ceiling rule.',
      },
    ],
    resultImpact:
      'Unplugging your phone around 80% preserves battery chemistry and allows your phone to hold a strong charge for 3 to 4 years instead of dying quickly after just 1 year.',
    actionRecommendation:
      'Keep this Longevity Guard switch turned ON. When your phone reaches 80% while plugged into the wall, the app will give you a gentle reminder buzz so you can unplug it.',
  },

  battery_drain_rate: {
    id: 'battery_drain_rate',
    title: 'Battery Discharge Velocity',
    badge: 'Power Consumption',
    icon: 'flash-outline',
    color: '#F59E0B',
    animationType: 'battery_balloon',
    simpleWords:
      'Discharge velocity is like the fuel consumption speedometer in a car. It calculates how many percent of battery your phone is burning through every hour.',
    whatIsHappening: [
      {
        freq: 'Under 10%/hr (Green)',
        meaning: 'Excellent power efficiency. The phone is in a relaxed, power-saving state.',
        hearing: 'Normal everyday reading, light messaging, or idle standby.',
      },
      {
        freq: '10% to 18%/hr (Yellow)',
        meaning: 'Moderate usage. Video streaming, GPS maps, or higher screen brightness.',
        hearing: 'Standard daytime operation.',
      },
      {
        freq: 'Over 20%/hr (Red Alert)',
        meaning: 'Heavy rapid drain. The processor or a runaway background app is draining power rapidly.',
        hearing: 'Phone will get noticeably warm to the touch.',
      },
    ],
    resultImpact:
      'Consistently high drain means you will need to recharge multiple times a day and subjects the battery to frequent recharge cycles.',
    actionRecommendation:
      'If you see Rapid Drain (>20%/hr): (1) Lower your screen brightness slightly. (2) Close unused background apps (like camera or navigation). (3) Turn off Bluetooth or Hotspot if not actively in use.',
  },

  battery_thermal: {
    id: 'battery_thermal',
    title: 'Battery Temperature & Health',
    badge: 'Thermal Safety',
    icon: 'thermometer-outline',
    color: '#EF4444',
    animationType: 'battery_balloon',
    simpleWords:
      'Batteries are sensitive chemical packs. Heat is their greatest enemy. This monitor measures your device temperature to ensure internal components never reach dangerous thermal thresholds.',
    whatIsHappening: [
      {
        freq: 'Below 35°C (Cool)',
        meaning: 'Optimal operating zone. Zero degradation occurring.',
        hearing: 'Phone feels cool or room temperature.',
      },
      {
        freq: '35°C to 42°C (Warm)',
        meaning: 'Normal during fast charging, video playback, or warm weather.',
        hearing: 'Phone feels comfortably warm in your hand.',
      },
      {
        freq: 'Above 43°C (Overheating Alert)',
        meaning: 'Thermal throttle zone. Phone processor will slow down to protect the battery.',
        hearing: 'Phone feels very hot. Risk of permanent capacity loss.',
      },
    ],
    resultImpact:
      'Keeping your phone cool prevents battery swelling, unexpected shutdowns, and permanent battery health degradation.',
    actionRecommendation:
      'Never leave your phone on a car dashboard in direct sunlight. If the phone feels hot while charging, take off thick protective plastic cases during the charging session.',
  },

  screen_dead_pixels: {
    id: 'screen_dead_pixels',
    title: 'Dead Pixel & OLED Inspection',
    badge: 'Display Health',
    icon: 'color-palette-outline',
    color: '#00F2FE',
    animationType: 'pixel_grid',
    simpleWords:
      'Your phone display is made of over 2 million microscopic colored light bulbs (red, green, and blue). A "dead pixel" is a bulb that has burned out and permanently stays pitch black or frozen in one bright color.',
    whatIsHappening: [
      {
        freq: 'Full-Screen Color Cycle',
        meaning:
          'By filling the entire screen with pure Red, Green, Blue, White, and Black, any broken pixel immediately sticks out like a speck of dust that won’t wipe off.',
        hearing: 'Look closely across the entire glass surface during the color change.',
      },
    ],
    resultImpact:
      'Dead pixels do not spread, but they can be distracting and severely lower the resale value if you try to sell or exchange your phone.',
    actionRecommendation:
      'If you spot a dead pixel on a brand-new phone under warranty, contact the manufacturer service center for a free screen replacement.',
  },

  touch_digitizer: {
    id: 'touch_digitizer',
    title: 'Touch Screen Digitizer & Multi-Touch',
    badge: 'Touch Controller',
    icon: 'finger-print-outline',
    color: '#10B981',
    animationType: 'touch_grid',
    simpleWords:
      'Beneath your phone glass sits an invisible electrical sensor grid called a digitizer. It senses the natural electrical charge in your fingers whenever and wherever you touch the screen.',
    whatIsHappening: [
      {
        freq: 'Dead Touch Zones',
        meaning:
          'When you drop a phone, internal microscopic grid lines can snap. The glass might look unbroken, but corners (like where the keyboard "P" or "Q" keys sit) stop responding to your finger.',
        hearing: 'Dragging your finger over every tile tests 100% of the screen surface.',
      },
      {
        freq: 'Multi-Touch Radar',
        meaning:
          'Tests how many fingers the phone can track at the exact same instant (for zooming photos, gaming, or multi-finger gestures). Most phones support up to 10 fingers.',
        hearing: 'Place multiple fingers on the glass to see the active counters.',
      },
    ],
    resultImpact:
      'Dead touch zones cause missed taps, ghost typing, or frustration when tapping buttons near the edge of the screen.',
    actionRecommendation:
      'If any grid tile refuses to turn green after dragging your finger directly over it, that zone has a hardware digitizer fault and may require a screen assembly repair.',
  },

  sensors_compass_flux: {
    id: 'sensors_compass_flux',
    title: 'Compass & Magnetic Flux (µT)',
    badge: 'Orientation Sensor',
    icon: 'navigate-circle-outline',
    color: '#00F2FE',
    animationType: 'compass_rose',
    simpleWords:
      'Your phone contains a microscopic magnetometer chip that senses invisible magnetic forces. It acts just like a physical handheld magnetic compass needle pointing toward Earth’s Magnetic North Pole.',
    whatIsHappening: [
      {
        freq: 'What is µT (Microtesla)?',
        meaning:
          'Microtesla (µT) is the scientific unit measuring magnetic strength. Natural Earth magnetic field is usually between 25 µT and 65 µT.',
        hearing: 'If the number shoots up to 200+ µT, your phone is close to an artificial magnet.',
      },
      {
        freq: 'Why calibrate in a figure-8?',
        meaning:
          'Moving your phone in a smooth figure-8 motion recalibrates the chip by sampling ambient magnetic fields from every 3D angle.',
        hearing: 'Helps Google Maps orient your arrow accurately.',
      },
    ],
    resultImpact:
      'An accurate compass ensures Google Maps, pedestrian navigation, and star-gazing apps show the exact direction you are walking.',
    actionRecommendation:
      'Magnetic phone wallet cases or magnetic car mounts can distort the compass reading. Keep your phone slightly away from strong refrigerator magnets or metal tables during compass testing.',
  },

  sensors_lux: {
    id: 'sensors_lux',
    title: 'Ambient Light Photometer (Lux)',
    badge: 'Light Sensor',
    icon: 'bulb-outline',
    color: '#F59E0B',
    animationType: 'compass_rose',
    simpleWords:
      'Next to your front earpiece is a tiny light meter called a photometer. It measures how bright your room or surroundings are so the phone can automatically adjust your screen brightness.',
    whatIsHappening: [
      {
        freq: 'What is Lux?',
        meaning:
          '1 Lux equals the gentle light emitted by a single candle 1 meter away. Dark bedrooms are 0–5 Lux; indoor offices are 300–500 Lux; direct bright outdoor sunshine exceeds 10,000+ Lux.',
        hearing: 'Cover the top of your phone with your hand to watch the Lux drop to zero!',
      },
    ],
    resultImpact:
      'If this sensor is dirty or broken, auto-brightness will stay blindingly bright at night or too dim to read outdoors in sunlight.',
    actionRecommendation:
      'If the Lux meter stays stuck at 0 Lux, wipe the front glass above the screen with a clean cloth to remove pocket lint or smudged oils covering the sensor window.',
  },

  memory_ram_vs_storage: {
    id: 'memory_ram_vs_storage',
    title: 'RAM (Memory) vs Storage (Flash)',
    badge: 'Hardware Memory',
    icon: 'server-outline',
    color: '#8B5CF6',
    animationType: 'ram_desk',
    simpleWords:
      'People often confuse RAM and Storage. The easiest way to remember: RAM is your Kitchen Counter (where you work right now), while Storage is your Pantry or Refrigerator (where things are saved long-term).',
    whatIsHappening: [
      {
        freq: 'RAM (Memory — e.g. 6GB / 8GB)',
        meaning:
          'Temporary high-speed workspace. When you open WhatsApp, Maps, and YouTube, they sit on your RAM counter. When you turn off the phone, RAM clears completely.',
        hearing: 'More RAM allows switching between multiple apps without them reloading.',
      },
      {
        freq: 'Storage (Flash Drive — e.g. 128GB / 256GB)',
        meaning:
          'Permanent storage cabinet. This is where all your photos, videos, songs, and installed app files are permanently kept even when the phone is turned off.',
        hearing: 'Running out of storage prevents saving new photos or downloading app updates.',
      },
    ],
    resultImpact:
      'Keeping at least 15% of your internal storage free ensures the operating system has room to move files smoothly without freezing or slowing down.',
    actionRecommendation:
      'You do not need to constantly close apps from RAM—Android manages memory automatically. If your phone feels sluggish, check that your Storage has at least 5GB to 10GB of free space.',
  },

  hardware_passport: {
    id: 'hardware_passport',
    title: 'Hardware Inspection Passport',
    badge: 'Pre-Owned Verification',
    icon: 'ribbon-outline',
    color: '#F59E0B',
    animationType: 'touch_grid',
    simpleWords:
      'Just like a doctor’s health certificate or a car inspection report, the Hardware Passport is a verified digital summary certifying which physical hardware parts are healthy and tested.',
    whatIsHappening: [
      {
        freq: 'Fraud & Repair Protection',
        meaning:
          'When buying or selling a used smartphone on OLX, Cashify, or from friends, buyers worry about hidden water damage, broken microphones, or replaced counterfeit screens.',
        hearing: 'The passport summarizes every sensor, screen pixel, and battery metric in one card.',
      },
    ],
    resultImpact:
      'Provides transparent proof of working hardware, helping you negotiate a higher resale price or avoid getting scammed when buying pre-owned phones.',
    actionRecommendation:
      'Before handing over or purchasing a pre-owned phone, run through the tests in this app, then tap "Export Passport Certificate" to copy and share the verified hardware card.',
  },

  system_health_audit: {
    id: 'system_health_audit',
    title: 'System Health Audit',
    badge: 'Diagnostic Scan',
    icon: 'shield-checkmark',
    color: '#00F2FE',
    animationType: 'touch_grid',
    simpleWords:
      'Like a comprehensive checkup with your family doctor, a System Health Audit tests all vital organs of your smartphone at once: memory headroom, battery temperature, free storage space, and internet connectivity.',
    whatIsHappening: [
      {
        freq: 'Memory & Headroom',
        meaning:
          'Ensures there is ample free RAM counter space so the phone does not stutter or freeze when switching between apps.',
        hearing: 'A score of 90-100 means silky smooth performance.',
      },
      {
        freq: 'Storage & Thermal Stability',
        meaning:
          'Verifies you have at least 15% free internal storage and that battery temperature is in the safe cool zone.',
        hearing: 'Warns you before your phone runs out of storage space or overheats.',
      },
    ],
    resultImpact:
      'Provides a clean 0-100 score with simple green (Great), yellow (Caution), or red (Action needed) cards telling you exactly how your phone is doing.',
    actionRecommendation:
      'Run this audit once a month or whenever your phone begins feeling slow or warm to the touch.',
  },

  network_latency_ping: {
    id: 'network_latency_ping',
    title: 'Internet Gateway & Ping Latency',
    badge: 'Network Health',
    icon: 'wifi-outline',
    color: '#06B6D4',
    animationType: 'speaker_cone',
    simpleWords:
      'Ping is like shouting across a canyon and waiting to hear your echo bounce back. It measures how many milliseconds (thousandths of a second) it takes for a message to leave your phone, touch the internet server, and return.',
    whatIsHappening: [
      {
        freq: 'Fast Ping (< 50 ms)',
        meaning:
          'Super fast response. Video calls, WhatsApp audio, and website pages load immediately with zero voice stutter or lag.',
        hearing: 'Optimal for crystal-clear family phone calls.',
      },
      {
        freq: 'High Ping (> 200 ms)',
        meaning:
          'High delay. People may talk over each other on WhatsApp calls or YouTube videos might buffer and pause.',
        hearing: 'Caused by distant servers, weak Wi-Fi signal, or cell tower traffic.',
      },
      {
        freq: 'What is an IP Address?',
        meaning:
          'Like your house postal street address, an IP address is your phone’s temporary digital door number on your Wi-Fi router so incoming messages reach your specific phone.',
        hearing: 'Usually looks like 192.168.1.X on home Wi-Fi networks.',
      },
    ],
    resultImpact:
      'Low latency ensures smooth video calls with children and grandkids, instant photo delivery, and quick web page loading.',
    actionRecommendation:
      'If your ping is higher than 250ms: (1) Walk closer to your home Wi-Fi router. (2) Turn Airplane mode ON for 5 seconds and then turn it back OFF to reconnect fresh.',
  },

  sensors_accelerometer: {
    id: 'sensors_accelerometer',
    title: 'Gravity & Accelerometer Sensor',
    badge: 'Motion Sensor',
    icon: 'compass-outline',
    color: '#00F2FE',
    animationType: 'compass_rose',
    simpleWords:
      'Inside your phone is a microscopic silicon weight suspended on tiny springs. Whenever you tilt, turn, or walk with your phone, Earth’s gravity pulls on this tiny weight, letting the phone know whether you are holding it upright, flat, or sideways.',
    whatIsHappening: [
      {
        freq: 'Auto-Rotate & Horizon',
        meaning:
          'When you turn your phone sideways to watch a video, this sensor detects the tilt and rotates the screen automatically.',
        hearing: 'The circular bubble level shows if a table or picture frame is 100% flat.',
      },
      {
        freq: 'Step Counting (Pedometer)',
        meaning:
          'Every time your heel touches the pavement while walking, the rhythmic bounce is counted by the accelerometer as one step.',
        hearing: 'Used by fitness and daily step counter apps.',
      },
    ],
    resultImpact:
      'If this sensor is damaged from a hard drop, auto-rotate stops working and photos may save sideways or upside-down.',
    actionRecommendation:
      'Place your phone flat on a level tabletop: the bubble level should sit right in the center green crosshair.',
  },
};
