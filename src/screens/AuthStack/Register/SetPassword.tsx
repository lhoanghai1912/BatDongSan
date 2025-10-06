import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Vibration,
  Animated,
  ActivityIndicator,
} from 'react-native';
import AppInput from '../../../components/AppInput';
import { ICONS, IMAGES, message, text } from '../../../utils/constants';
import { Spacing } from '../../../utils/spacing';
import AppButton from '../../../components/AppButton';
import { Colors } from '../../../utils/color';
import Toast from 'react-native-toast-message';

import NavBar from '../../../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserData } from '../../../store/reducers/userSlice';
import { create_password, login, reset_password } from '../../../service';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
interface Props {
  navigation: any;
  route?: any;
}
const SetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const { verificationToken } = useSelector((state: any) => state.user);
  const [password, SetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Luôn nhận key 'source' từ route.params để phân biệt nguồn gọi
  const source = route.params.source;

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isMatch = password === confirmPassword;
  const isValid = hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  console.log('data truyen qua', route);

  const handleRegister = async () => {
    if (!isMatch) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: `${t(message.text1Error)}`,
        text2: `${t(message.not_match)}`,
      });
      return;
    }
    if (!isValid) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text2: t(message.validate),
      });
      return;
    }
    setLoading(true);
    try {
      if (source === 'register') {
        const res = await create_password(
          verificationToken,
          password,
          confirmPassword,
        );
        console.log('output', res);
        dispatch(setToken({ token: res.user.token }));
        Toast.show({
          type: 'success',
          text1: `${t(message.text1Success)}`,
          text2: `${t(message.registerSuccess)}`,
        });
      } else if (source === 'forgot') {
        const res = await reset_password(
          route.params.contact,
          route.params.otp,
          password,
          confirmPassword,
        );
        console.log('output', res);
        Toast.show({
          type: 'success',
          text1: `${t(message.text1Success)}`,
          text2: `${t(message.change_password)}`,
        });
      }
      const loginData = await login(route.params.contact, password);
      console.log('loginRes', loginData);
      dispatch(setToken({ token: loginData.token }));
      dispatch(setUserData({ userData: loginData.profile }));
      navigate(Screen_Name.BottomTab_Navigator, {
        screen: Screen_Name.Home_Screen,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  console.log('token', token);

  return (
    <View style={[styles.container]}>
      <NavBar
        title={t(message.enter_password)}
        onPress={() => navigation.goBack()}
      />
      <View style={{ marginBottom: Spacing.large }}>
        <Image
          source={IMAGES.logo}
          style={{
            width: 170,
            height: 100,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
      </View>

      <View>
        <AppInput
          label={t(text.new_password)}
          leftIcon={ICONS.password}
          placeholder={t(text.new_password)}
          onChangeText={SetPassword}
          secureTextEntry={true}
          value={password}
        />
      </View>
      <View>
        <AppInput
          label={t(text.confirm_password)}
          leftIcon={ICONS.password}
          placeholder={t(text.confirm_password)}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          value={confirmPassword}
        />
      </View>

      <View style={{ marginBottom: Spacing.xxxxlarge }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasMinLength ? ICONS.valid : ICONS.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? Colors.Gray
                : hasMinLength
                ? Colors.Gray
                : Colors.red,
            }}
          >
            {t(message.password_min_length)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasUpperCase ? ICONS.valid : ICONS.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? Colors.Gray
                : hasUpperCase
                ? Colors.Gray
                : Colors.red,
            }}
          >
            {t(message.password_uppercase)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasNumber ? ICONS.valid : ICONS.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? Colors.Gray
                : hasNumber
                ? Colors.Gray
                : Colors.red,
            }}
          >
            {t(message.password_number)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasSpecialChar ? ICONS.valid : ICONS.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? Colors.Gray
                : hasSpecialChar
                ? Colors.Gray
                : Colors.red,
            }}
          >
            {t(message.password_special_character)}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0.5,
          borderColor: Colors.Gray,
          marginBottom: Spacing.medium,
        }}
      />
      <View style={{ marginBottom: Spacing.xlarge }}>
        <AppButton title={t(text.submit)} onPress={handleRegister} />
      </View>
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.white,
  },
});

export default SetPasswordScreen;
