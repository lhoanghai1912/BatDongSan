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
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  enableScreens(); // Bật tính năng screens để sử dụng trong navigation
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
