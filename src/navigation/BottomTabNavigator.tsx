import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';

// Các màn hình cho các tab

import { ICONS } from '../utils/constants'; // Assuming ICONS is the path where you store your icons
import AppStyles from '../components/AppStyle';
import HeartScreen from '../screens/HomeStack/Heart';
import UserScreen from '../screens/HomeStack/User';
import HomeScreen from '../screens/HomeStack/HomeScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // Tắt nhãn label của tab
        tabBarStyle: {
          height: 70,
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          // Chọn icon dựa trên tên route
          switch (route.name) {
            case 'Home':
              iconSource = !focused ? ICONS.search : ICONS.search_focus;
              break;
            case 'Heart':
              iconSource = !focused ? ICONS.heart : ICONS.heart_focus;
              break;

            case 'Notification':
              iconSource = !focused ? ICONS.user : ICONS.user_focus;
              break;
          }

          return (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={iconSource}
                style={[AppStyles.icon, { width: 30, height: 30 }]}
              />
              {focused && (
                <View
                  style={{
                    width: 30,
                    height: 2,
                    backgroundColor: '#820201',
                    marginTop: 3,
                    borderRadius: 5,
                  }}
                />
              )}
            </View>
          );
        },
        tabBarActiveTintColor: '#820201',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Heart" component={HeartScreen} />
      <Tab.Screen name="Cart" component={UserScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
