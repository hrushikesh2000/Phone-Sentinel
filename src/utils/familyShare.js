import { Linking, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TRANSLATIONS } from './translations';
import { formatBytes } from './formatters';

/**
 * Format and send an empathetic, non-technical phone status report to family via WhatsApp
 */
export async function sharePhoneHealthWithFamily({
  hardware = {},
  batteryData = {},
  language = 'en',
}) {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (e) {}

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const percentage =
    batteryData.batteryLevel !== null && batteryData.batteryLevel >= 0
      ? Math.round(batteryData.batteryLevel * 100)
      : 100;

  const isCharging =
    batteryData.batteryState === 2 || batteryData.batteryState === 3;

  const batteryText = `${percentage}% (${
    isCharging ? t.battery_status_charging : t.battery_status_good
  })`;

  const storageFreeFormatted = hardware.freeStorage
    ? formatBytes(hardware.freeStorage, 0)
    : 'Available';

  const message = [
    t.whatsapp_greeting,
    '',
    `${t.whatsapp_battery} ${batteryText}`,
    `${t.whatsapp_storage} ${storageFreeFormatted} Free`,
    t.whatsapp_overall,
    '',
    t.whatsapp_closing,
  ].join('\n');

  const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

  try {
    const supported = await Linking.canOpenURL(whatsappUrl);
    if (supported) {
      await Linking.openURL(whatsappUrl);
      return { success: true, method: 'whatsapp' };
    } else {
      // Fallback to native system share sheet (SMS, Telegram, Gmail, etc.)
      await Share.share({
        message,
        title: t.wizard_title,
      });
      return { success: true, method: 'system_share' };
    }
  } catch (err) {
    // Ultimate fallback to Share
    try {
      await Share.share({ message });
      return { success: true, method: 'system_share' };
    } catch (shareErr) {
      return { success: false, error: shareErr };
    }
  }
}

