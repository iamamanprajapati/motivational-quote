import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

function TabNavigator() {
  const { colors, isDark } = useApp();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          height: 62,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
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

const styles = StyleSheet.create({});
