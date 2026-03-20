/**
 * Daily Motivation — React Native CLI (offline)
 * @format
 */

import React from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider, useApp } from './src/context/AppContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AppNavigator from './src/navigation/AppNavigator';

function Gate() {
  const { ready, onboardingDone, colors } = useApp();

  if (!ready) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.screenBg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!onboardingDone) {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <AppInner />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppInner() {
  const { colors } = useApp();
  return (
    <>
      <StatusBar
        translucent
        barStyle={colors.statusBar}
        backgroundColor="transparent"
      />
      <Gate />
    </>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default App;
