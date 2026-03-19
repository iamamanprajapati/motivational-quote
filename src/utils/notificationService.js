import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

const CHANNEL_ID = 'daily-motivation';
const TRIGGER_NOTIF_ID = 'daily-motivation-trigger';

export async function ensureChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Daily Motivation',
    importance: AndroidImportance.DEFAULT,
    sound: 'default',
  });
}

export async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  const settings = await notifee.requestPermission();
  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
}

function nextNineAm(from = new Date()) {
  const d = new Date(from);
  d.setHours(9, 0, 0, 0);
  if (d.getTime() <= from.getTime()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export async function scheduleDailyReminder() {
  await ensureChannel();
  await notifee.cancelTriggerNotification(TRIGGER_NOTIF_ID);
  const when = nextNineAm();
  await notifee.createTriggerNotification(
    {
      id: TRIGGER_NOTIF_ID,
      title: 'Daily Motivation',
      body: 'Your daily motivation is ready!',
      android: {
        channelId: CHANNEL_ID,
        pressAction: { id: 'default' },
      },
      ios: { sound: 'default' },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: when.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    },
  );
}

export async function cancelDailyReminder() {
  await notifee.cancelTriggerNotification(TRIGGER_NOTIF_ID);
}
