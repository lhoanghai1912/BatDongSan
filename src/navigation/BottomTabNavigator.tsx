import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';

// Các màn hình cho các tab

import { ICONS } from '../utils/constants'; // Assuming ICONS is the path where you store your icons
import HeartScreen from '../screens/HomeStack/Heart';
import HomeScreen from '../screens/HomeStack/Home/HomeScreen';
import { Screen_Name } from './ScreenName';
import SettingScreen from '../screens/HomeStack/Setting';
import { useSelector } from 'react-redux';
import DocumentScreen from '../screens/HomeStack/Document';
import CreateScreen from '../screens/HomeStack/Create';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { token } = useSelector((state: any) => state.user); // ✅ lấy token từ Redux

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
            Create_Screen: focused ? ICONS.plus_focus : ICONS.plus,
            Document_Screen: focused ? ICONS.clause_focus : ICONS.clause,
            Heart_Screen: focused ? ICONS.heart_focus : ICONS.heart,
            Setting_Screen: focused ? ICONS.user_focus : ICONS.user,
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
      {/* ✅ Thêm 2 tab mới nếu có token */}
      {token && (
        <>
          <Tab.Screen
            name={Screen_Name.Document_Screen}
            component={DocumentScreen}
          />
          <Tab.Screen
            name={Screen_Name.Create_Screen}
            component={CreateScreen}
          />
        </>
      )}
      <Tab.Screen name={Screen_Name.Heart_Screen} component={HeartScreen} />
      <Tab.Screen name={Screen_Name.Setting_Screen} component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
