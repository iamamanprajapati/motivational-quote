import { Platform, Alert } from 'react-native';
import Share, { Social } from 'react-native-share';

function toFileUrl(path) {
  if (!path) {
    return '';
  }
  const p = path.replace(/^file:\/\//, '');
  return Platform.OS === 'ios' ? `file://${p}` : `file://${p}`;
}

const baseOpts = filePath => ({
  type: 'image/png',
  url: toFileUrl(filePath),
  failOnCancel: false,
});

export async function shareImageSystemSheet(filePath, title = 'Daily Motivation') {
  const url = toFileUrl(filePath);
  await Share.open({
    title,
    urls: [url],
    type: 'image/png',
    failOnCancel: false,
  });
}

async function shareSingleSafe(social, label, filePath) {
  try {
    await Share.shareSingle({
      social,
      ...baseOpts(filePath),
    });
  } catch (e) {
    if (e?.message !== 'User did not share') {
      Alert.alert(
        label,
        'Could not open the app. It may not be installed, or sharing failed.',
      );
    }
  }
}

export const shareTargets = {
  whatsapp: filePath => shareSingleSafe(Social.Whatsapp, 'WhatsApp', filePath),
  instagram: filePath => shareSingleSafe(Social.Instagram, 'Instagram', filePath),
  facebook: filePath => shareSingleSafe(Social.Facebook, 'Facebook', filePath),
  twitter: filePath => shareSingleSafe(Social.Twitter, 'X (Twitter)', filePath),
  telegram: filePath => shareSingleSafe(Social.Telegram, 'Telegram', filePath),
};
