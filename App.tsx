/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';

function App() {
  enableScreens(); // Bật tính năng screens để sử dụng trong navigation
  return (
    <>
      <Provider store={store}>
        <AppNavigator />
        <Toast />
      </Provider>
    </>
  );
}

export default App;
