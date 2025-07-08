import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { navigationRef } from './RootNavigator';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import { useSelector } from 'react-redux';
import SplashScreen from '../screens/Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { token } = useSelector((state: any) => state.user);
  console.log(token, 'token in AppNavigator');

  useEffect(() => {
    // delay splash 1.5s để hiển thị logo
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (showSplash) {
    return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {token ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
