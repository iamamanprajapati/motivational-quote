import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const animEntry = { duration: () => ({}) };
  const noop = () => {};
  const noopVal = () => ({ value: 0 });
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: c => c },
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: () => ({}),
    withTiming: (val, _opts, cb) => { if (cb) { cb(true); } return val; },
    withSpring: (val) => val,
    runOnJS: (fn) => fn,
    interpolate: (val) => val,
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    FadeIn: animEntry,
    FadeInDown: animEntry,
    FadeInUp: animEntry,
    SlideInDown: animEntry,
    SlideInUp: animEntry,
    ZoomIn: animEntry,
  };
});

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
    cancelTriggerNotification: jest.fn(),
    createTriggerNotification: jest.fn(),
  },
  AndroidImportance: { DEFAULT: 3 },
  AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2 },
  RepeatFrequency: { DAILY: 1 },
  TriggerType: { TIMESTAMP: 0 },
}));

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: {
    open: jest.fn(() => Promise.resolve()),
    shareSingle: jest.fn(() => Promise.resolve()),
  },
  Social: {},
}));

jest.mock('react-native-view-shot', () => ({
  __esModule: true,
  default: 'ViewShot',
  captureRef: jest.fn(() => Promise.resolve('/tmp/mock.png')),
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

jest.mock('@react-native-camera-roll/camera-roll', () => ({
  CameraRoll: { saveAsset: jest.fn(() => Promise.resolve()) },
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  const Icon = ({ name, ...props }) => {
    const React = require('react');
    return React.createElement(Text, props, name);
  };
  Icon.getImageSource = jest.fn(() => Promise.resolve({ uri: '' }));
  return Icon;
});

jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: '/cache',
  DocumentDirectoryPath: '/doc',
  copyFile: jest.fn(() => Promise.resolve()),
}));
