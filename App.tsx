/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId:
    '933795750129-idvkam8p59s26v1mv2ooainof52cd1it.apps.googleusercontent.com',
  offlineAccess: true,
});
enableScreens(); // Bật tính năng screens để sử dụng trong navigation
function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" translucent={false} />
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppNavigator />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
