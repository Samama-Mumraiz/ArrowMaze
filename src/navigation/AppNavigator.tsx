import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../view/screens/GameScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SplashScreen from '../screens/SplashScreen';
import LevelSelectionScreen from '../screens/LevelSelectionScreen';
import { useTheme, AppTheme } from '../theme/ThemeContext';

export type RootTabParamList = {
  Splash: undefined;
  Home: undefined;
  Play: undefined;
  Game?: undefined;
  LevelSelection: undefined;
  Levels?: undefined;
  Profile: undefined;
  Settings: undefined;
  Rewards?: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

interface TabBarIconWrapperProps {
  name: keyof typeof Ionicons.glyphMap;
  outlineName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  theme: AppTheme;
}

function TabBarIconWrapper({
  name,
  outlineName,
  focused,
  color,
  theme,
}: TabBarIconWrapperProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.iconPill,
        focused && {
          backgroundColor: theme.isDark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.08)',
          borderColor: theme.isDark
            ? 'rgba(255, 255, 255, 0.25)'
            : 'rgba(0, 0, 0, 0.16)',
        },
      ]}
    >
      <Ionicons
        name={focused ? name : outlineName}
        size={20}
        color={color}
      />
    </View>
  );
}

export default function AppNavigator(): React.JSX.Element {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Dynamically resolve bottom inset to prevent tabs from clipping or sitting too low
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 20 : 8);
  const tabContentHeight = 54;
  const totalBarHeight = tabContentHeight + bottomInset;

  return (
    <Tab.Navigator
      initialRouteName="Splash"
      safeAreaInsets={{ bottom: bottomInset }}
      screenOptions={({ route }) => {
        const isHidden =
          route.name === 'Splash' ||
          route.name === 'Home' ||
          route.name === 'Play' ||
          (route.name as string) === 'Game' ||
          (route.name as string) === 'LevelSelection' ||
          (route.name as string) === 'Levels' ||
          route.name === 'Settings';

        return {
          headerShown: false,
          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.tabBarInactive,
          tabBarStyle: isHidden
            ? { display: 'none', height: 0, position: 'absolute', bottom: -200 }
            : [
                styles.tabBar,
                {
                  backgroundColor: theme.tabBarBg,
                  borderTopColor: theme.tabBarBorder,
                  height: totalBarHeight,
                  paddingTop: 5,
                  paddingBottom: bottomInset,
                  shadowColor: theme.isDark ? '#000000' : 'rgba(15, 23, 42, 0.12)',
                },
              ],
          tabBarItemStyle: styles.tabBarItem,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarLabelStyle: styles.tabBarLabel,
        };
      }}
    >
      {/* 0. Splash Screen (Initial Entry - Hidden from Tab Bar) */}
      <Tab.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />

      {/* 1. Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIconWrapper
              name="home"
              outlineName="home-outline"
              focused={focused}
              color={color}
              theme={theme}
            />
          ),
        }}
      />

      {/* 2. Play Tab */}
      <Tab.Screen
        name="Play"
        component={GameScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />

      {/* 2b. Game Route Alias */}
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />

      {/* 2c. Level Selection Screen */}
      <Tab.Screen
        name="LevelSelection"
        component={LevelSelectionScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />

      {/* 2d. Levels Alias */}
      <Tab.Screen
        name="Levels"
        component={LevelSelectionScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />

      {/* 3. Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIconWrapper
              name="person"
              outlineName="person-outline"
              focused={focused}
              color={color}
              theme={theme}
            />
          ),
        }}
      />

      {/* 4. Settings Tab */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIconWrapper
              name="settings"
              outlineName="settings-outline"
              focused={focused}
              color={color}
              theme={theme}
            />
          ),
        }}
      />

      {/* 5. Rewards Route Alias */}
      <Tab.Screen
        name="Rewards"
        component={ProfileScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    elevation: 16,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
  },
  tabBarItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    height: 48,
  },
  tabBarIcon: {
    width: 46,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  iconPill: {
    width: 44,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 2,
    marginBottom: 0,
    paddingBottom: 0,
    textAlign: 'center',
  },
});
