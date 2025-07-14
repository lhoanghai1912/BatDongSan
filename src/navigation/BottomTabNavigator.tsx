import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';

// Các màn hình cho các tab

import { ICONS } from '../utils/constants'; // Assuming ICONS is the path where you store your icons
import AppStyles from '../components/AppStyle';
import HeartScreen from '../screens/HomeStack/Heart';
import UserScreen from '../screens/HomeStack/User';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import { Screen_Name } from './ScreenName';
import SettingScreen from '../screens/HomeStack/Setting';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
          paddingTop: 10,
        },
        tabBarIcon: ({ focused }) => {
          const iconMap = {
            Home_Screen: focused ? ICONS.search_focus : ICONS.search,
            Heart_Screen: focused ? ICONS.heart_focus : ICONS.heart,
            User_Screen: focused ? ICONS.user_focus : ICONS.user,
          };

          return (
            <Image
              source={iconMap[route.name]}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#820201',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name={Screen_Name.Home_Screen} component={HomeScreen} />
      <Tab.Screen name={Screen_Name.Heart_Screen} component={HeartScreen} />
      <Tab.Screen name={Screen_Name.Setting_Screen} component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
