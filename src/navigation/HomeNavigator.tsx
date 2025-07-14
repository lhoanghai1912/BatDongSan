import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import { Screen_Name } from './ScreenName';
import BottomTabNavigator from './BottomTabNavigator';
import DetailScreen from '../screens/HomeStack/Detail';
import SettingScreen from '../screens/HomeStack/Setting';
import UserScreen from '../screens/HomeStack/User';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={Screen_Name.Bottom_Navigator}
    >
      <Stack.Screen
        name={Screen_Name.Bottom_Navigator}
        component={BottomTabNavigator}
      />
      <Stack.Screen name={Screen_Name.Home_Screen} component={HomeScreen} />
      <Stack.Screen name={Screen_Name.Detail_Screen} component={DetailScreen} />
      <Stack.Screen
        name={Screen_Name.Setting_Screen}
        component={SettingScreen}
      />
      <Stack.Screen name={Screen_Name.User_Screen} component={UserScreen} />
    </Stack.Navigator>
  );
};
export default HomeNavigator;
