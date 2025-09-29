// App.tsx

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import store from './store';
import { StatusBar } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { Settings } from 'react-native-fbsdk-next';

enableScreens();

GoogleSignin.configure({
  webClientId:
    '933795750129-idvkam8p59s26v1mv2ooainof52cd1it.apps.googleusercontent.com',
  offlineAccess: true,
});

export default function App() {
  useEffect(() => {
    Settings.setAutoLogAppEventsEnabled(true);
    Settings.initializeSDK();
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
