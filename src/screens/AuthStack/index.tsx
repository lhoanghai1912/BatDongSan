import React, { useState, useTransition } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { ICONS, IMAGES, link, message, text } from '../../utils/constants';
import AppStyles from '../../components/AppStyle';
import AppInput from '../../components/AppInput';
import { Spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';
import { Colors } from '../../utils/color';
import AppButton from '../../components/AppButton';
import { Screen_Name } from '../../navigation/ScreenName';
import { navigate } from '../../navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserData } from '../../store/reducers/userSlice';
import { login } from '../../service';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { likePost } from '../../service/likeService';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [email, setEmail] = useState('hoanghai281zzz@gmail.com');
  const [password, setPassWord] = useState('123456Ab@');
  const [checked, setchecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {};

  const handleLogin = async () => {
    try {
      setLoading(true);

      const loginData = await login(email, password);
      console.log(loginData.token);

      dispatch(setToken({ token: loginData.token }));
      dispatch(setUserData({ userData: loginData.profile }));
      if (checked) {
        await AsyncStorage.setItem('accessToken', loginData.token);
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(loginData.profile),
        ); // Save user data
        syncLocalLikesToServer();
      }
      navigate(Screen_Name.BottomTab_Navigator, {
        screen: Screen_Name.Setting_Screen,
      });
      Toast.show({
        type: 'success',
        text1: `${t(text.welcome)}`,
        text2: `${loginData.profile.fullName}`,
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  const syncLocalLikesToServer = async () => {
    const savedLikes = await AsyncStorage.getItem('savedLikes');
    const likesArray = savedLikes ? JSON.parse(savedLikes) : [];

    for (const id of likesArray) {
      try {
        await likePost(id, true);
      } catch (err) {}
    }

    await AsyncStorage.removeItem('savedLikes');
  };

  const handleLoginWithGoogle = async () => {};
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: Spacing.xlarge }}>
        <Image
          source={IMAGES.logo}
          style={{
            width: 170,
            height: 100,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
        <Text style={[AppStyles.title, { marginBottom: Spacing.small }]}>
          {t(text.login)}
        </Text>
        <Text style={[AppStyles.text, { textAlign: 'center' }]}>
          {t(text.welcome)}
        </Text>
      </View>
      <View>
        <AppInput
          leftIcon={ICONS.username}
          placeholder={t(message.enter_userName)}
          onChangeText={setEmail}
          value={email}
        ></AppInput>
        <AppInput
          leftIcon={ICONS.password}
          placeholder={t(message.enter_password)}
          onChangeText={setPassWord}
          value={password}
          secureTextEntry={true}
        ></AppInput>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: Spacing.medium,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setchecked(!checked)}>
            <Image
              source={checked ? ICONS.checked : ICONS.unchecked}
              style={[AppStyles.icon, { width: 40, height: 40 }]}
            />
          </TouchableOpacity>
          <Text style={[AppStyles.text, { marginLeft: Spacing.small }]}>
            {t(text.remember)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleForgotPassword}>
          <Text
            style={{
              fontSize: Fonts.small,
              textDecorationLine: 'underline',
              color: Colors.red,
              fontWeight: 'bold',
            }}
          >
            {t(text.forgot)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: Spacing.xlarge }}>
        <AppButton
          title={t(text.login)}
          onPress={() => handleLogin()}
          disabled={!email || !password}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.large,
        }}
      >
        <View
          style={{
            height: 2,
            flex: 1,
            backgroundColor: Colors.lightGray,
          }}
        />
        <Text
          style={{
            fontSize: Fonts.normal,
            marginHorizontal: Spacing.small,
            color: Colors.Gray,
          }}
        >
          {t(message.other_login)}
        </Text>
        <View
          style={{
            height: 2,
            backgroundColor: Colors.lightGray,
            flex: 1,
          }}
        />
      </View>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
          marginBottom: Spacing.large,
        }}
      >
        <TouchableOpacity onPress={() => handleLoginWithGoogle()}>
          <Image source={ICONS.google} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICONS.apple} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: Spacing.large,
        }}
      >
        <Text style={AppStyles.text}>{t(message.nothave_account)}</Text>
        <TouchableOpacity onPress={() => navigate(Screen_Name.Register_Screen)}>
          <Text
            style={[
              AppStyles.text,
              {
                color: Colors.red,
                textDecorationLine: 'underline',
                marginLeft: Spacing.small,
              },
            ]}
          >
            {t(text.register)}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={[
            AppStyles.text,
            {
              fontSize: Fonts.small,
              textAlign: 'center', // ✅ Căn giữa toàn bộ dòng
              color: Colors.Gray,
            },
          ]}
        >
          {t(message.agree)}{' '}
          <Text
            onPress={() => Linking.openURL(`${link.company}`)}
            style={{
              color: Colors.black,
              fontWeight: '500',
              fontSize: Fonts.small,
              textDecorationLine: 'underline',
            }}
          >
            {t(text.terms_and_conditions)}
          </Text>
          ,{' '}
          <Text
            onPress={() => Linking.openURL(`${link.company}`)}
            style={{
              color: Colors.black,
              fontWeight: '500',
              fontSize: Fonts.small,
              textDecorationLine: 'underline',
            }}
          >
            {t(text.privacy_policy)}
          </Text>{' '}
          {t(text.of_us)}
        </Text>
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
    // justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.white,
  },
});

export default LoginScreen;
