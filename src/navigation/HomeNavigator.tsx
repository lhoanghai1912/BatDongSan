import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import { Screen_Name } from './ScreenName';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={Screen_Name.Home_Screen}
    >
      <Stack.Screen name={Screen_Name.Home_Screen} component={HomeScreen} />
    </Stack.Navigator>
  );
};
export default HomeNavigator;
