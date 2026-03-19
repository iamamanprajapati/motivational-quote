module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|react-navigation|@react-navigation/.*|@react-native-async-storage|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@notifee/.*)',
  ],
};
