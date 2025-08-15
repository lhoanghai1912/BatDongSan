import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { navigationRef } from './RootNavigator';
import HomeNavigator from './HomeNavigator';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from '../screens/Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken } from '../store/reducers/userSlice';
import HomeScreen from '../screens/HomeStack/Home/HomeScreen';
import LoginScreen from '../screens/AuthStack';
// const AppNavigator = () => {
//   const [showSplash, setShowSplash] = useState(true);
//   const { token } = useSelector((state: any) => state.user);

//   useEffect(() => {
//     // delay splash 1.5s để hiển thị logo
//     const timeout = setTimeout(() => {
//       setShowSplash(false);
//     }, 1500);
//     return () => clearTimeout(timeout);
//   }, []);

//   if (showSplash) {
//     return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />;
//   }

//   return (
//     <NavigationContainer ref={navigationRef}>
//       {token ? <HomeNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// };

const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.user);

  useEffect(() => {
    const bootstrap = async () => {
      const StorageToken = await AsyncStorage.getItem('accessToken');

      if (StorageToken) {
        dispatch(setToken({ token: StorageToken }));
      }
    };
    bootstrap();
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
      <HomeNavigator />
      {/* Logic cũ yêu cầu token để vào home: {token ? <HomeNavigator /> : <LoginScreen />} */}
    </NavigationContainer>
  );
};
export default AppNavigator;
