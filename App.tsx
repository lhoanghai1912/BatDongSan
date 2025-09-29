/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect } from 'react';

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Settings, AppEventsLogger } from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId:
    '933795750129-idvkam8p59s26v1mv2ooainof52cd1it.apps.googleusercontent.com',
  offlineAccess: true,
});
enableScreens(); // Bật tính năng screens để sử dụng trong navigation
function App() {
  useEffect(() => {
    // (tuỳ chọn) set App ID & bật auto init nếu muốn chủ động
    // Settings.setAppID("YOUR_FACEBOOK_APP_ID");
    Settings.setAutoLogAppEventsEnabled(true); // đảm bảo auto-log
    Settings.initializeSDK(); // tương đương ghi sự kiện kích hoạt app (fb_mobile_activate_app)
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar barStyle="light-content" translucent={false} />
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
