import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/theme';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { PlaceDetailsScreen } from '../screens/Details/PlaceDetailsScreen';
import { FavoritesScreen } from '../screens/Favorites/FavoritesScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const FavoritesStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="Search" component={SearchScreen} />
    <HomeStack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
  </HomeStack.Navigator>
);

const FavoritesStackNavigator = () => (
  <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
    <FavoritesStack.Screen name="FavoritesMain" component={FavoritesScreen} />
    <FavoritesStack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
  </FavoritesStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="Favorites" component={FavoritesScreen} />
    <ProfileStack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
  </ProfileStack.Navigator>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};
