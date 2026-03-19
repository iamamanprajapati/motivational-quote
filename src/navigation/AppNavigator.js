import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '../components/Icon';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import QuoteListScreen from '../screens/QuoteListScreen';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ── stable tab bar icon components ── */
function HomeIcon({ color, focused }) {
  return <Icon name={focused ? 'home' : 'home-outline'} size={24} color={color} />;
}
function DiscoverIcon({ color, focused }) {
  return <Icon name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />;
}
function FavoritesIcon({ color, focused }) {
  return <Icon name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />;
}
function SettingsIcon({ color, focused }) {
  return <Icon name={focused ? 'cog' : 'cog-outline'} size={24} color={color} />;
}

/* ── Liquid glass background rendered behind tab items ── */
function LiquidGlassBackground({ isDark }) {
  /* base glass body — lightly blackish for both themes */
  const baseColors = isDark
    ? ['rgba(10, 8, 18, 0.85)', 'rgba(5, 4, 12, 0.92)']
    : ['rgba(18, 14, 28, 0.72)', 'rgba(10, 8, 20, 0.80)'];

  /* top-edge shimmer gradient (the "wet glass" highlight) */
  const shimmerColors = isDark
    ? ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.00)']
    : ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.00)'];

  /* inner glow at the bottom edge */
  const glowColors = isDark
    ? ['rgba(160,156,255,0.00)', 'rgba(160,156,255,0.10)']
    : ['rgba(160,156,255,0.00)', 'rgba(160,156,255,0.08)'];

  const borderColor = isDark
    ? 'rgba(255, 255, 255, 0.10)'
    : 'rgba(255, 255, 255, 0.18)';

  return (
    <View style={styles.glassContainer}>
      {/* frosted-glass body */}
      <LinearGradient
        colors={baseColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* top-edge shimmer — mimics light catching the glass rim */}
      <LinearGradient
        colors={shimmerColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.shimmer}
      />
      {/* bottom inner glow */}
      <LinearGradient
        colors={glowColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomGlow}
      />
      {/* glass border ring */}
      <View style={[StyleSheet.absoluteFill, styles.borderRing, { borderColor }]} />
    </View>
  );
}

function TabNavigator() {
  const { colors, isDark } = useApp();

  const glowColor = isDark ? '#A09CFF' : '#5756CE';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
          height: 68,
          borderRadius: 28,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          /* iOS floating shadow / glow */
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.40 : 0.22,
          shadowRadius: 24,
          overflow: 'hidden',
        },
        tabBarBackground: () => <LiquidGlassBackground isDark={isDark} />,
        tabBarActiveTintColor: isDark ? '#A09CFF' : '#C4BFFF',
        tabBarInactiveTintColor: 'rgba(200, 196, 220, 0.50)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginBottom: 4,
        },
        tabBarItemStyle: { paddingTop: 6 },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: HomeIcon }}
      />
      <Tab.Screen
        name="Discover"
        component={CategoriesScreen}
        options={{ tabBarIcon: DiscoverIcon }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: FavoritesIcon,
          headerShown: true,
          headerTitle: 'Favorites',
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: {
            color: colors.onSurface,
            fontSize: 20,
            fontWeight: '800',
          },
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: SettingsIcon,
          headerShown: true,
          headerTitle: 'Settings',
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: {
            color: colors.onSurface,
            fontSize: 20,
            fontWeight: '800',
          },
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors } = useApp();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          color: colors.onSurface,
          fontSize: 20,
          fontWeight: '800',
        },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuoteList"
        component={QuoteListScreen}
        options={({ route }) => ({ title: route.params?.title || 'Quotes' })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  glassContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  borderRing: {
    borderRadius: 28,
    borderWidth: 1,
  },
});
