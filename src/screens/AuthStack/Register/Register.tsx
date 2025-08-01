import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Spacing } from '../../../utils/spacing';
import { ICONS, IMAGES, message, text } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { Colors } from '../../../utils/color';
import { Fonts } from '../../../utils/fontSize';
import NavBar from '../../../components/Navbar';
import EnterOtpModal from '../../../components/Modal/EnterOtpModal';
import { register } from '../../../service';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../store/reducers/loadingSlice';
import { useTranslation } from 'react-i18next';
interface Props {
  navigation: any;
}
const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const [contact, setContact] = useState('@gmail.com');

  const [isEnterOtpModalVisible, setIsEnterOtpModalVisible] = useState(false);
  const [resetcontact, setResetcontact] = useState(''); // giữ contact từ OTPModal
  const [resetOtp, setResetOtp] = useState('');

  const [Loading, setLoading] = useState(false);
  const handleRegister = async () => {
    try {
      setLoading(true);
      const registerData = await register(contact);
      console.log('resgisterData', registerData);

      setIsEnterOtpModalVisible(true);
      console.log('register pressed');
      setResetcontact(contact);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar title={t(message.register)} onPress={() => navigation.goBack()} />
      <View style={{ marginBottom: Spacing.xlarge }}>
        <Image
          source={IMAGES.logo}
          style={{
            width: 200,
            height: 100,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />

        <Text style={[AppStyles.text, { textAlign: 'center' }]}>
          {t(message.register)}
        </Text>
      </View>

      <View>
        <AppInput
          leftIcon={ICONS.username}
          placeholder={t(message.enter_userName)}
          onChangeText={setContact}
          value={contact}
        />
      </View>

      <View style={{ marginBottom: Spacing.xlarge }}>
        <AppButton
          title={t(text.submit)}
          onPress={() => handleRegister()}
          disabled={contact.length <= 10}
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
          {t(message.other_register)}
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
        <TouchableOpacity>
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
        <Text style={AppStyles.text}>{t(message.have_account)} </Text>
        <TouchableOpacity onPress={() => navigate(Screen_Name.Login_Screen)}>
          <Text
            style={[
              AppStyles.text,
              { color: Colors.red, textDecorationLine: 'underline' },
            ]}
          >
            {t(text.login)}
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
            onPress={() =>
              Linking.openURL(
                'https://trogiup.batdongsan.com.vn/docs/dieu-khoan-thoa-thuan',
              )
            }
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
            onPress={() =>
              Linking.openURL(
                'https://trogiup.batdongsan.com.vn/docs/chinh-sach-bao-mat',
              )
            }
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
      <EnterOtpModal
        visible={isEnterOtpModalVisible}
        onClose={() => setIsEnterOtpModalVisible(false)}
        contact={resetcontact}
        onSuccess={otp => {
          setResetOtp(otp);
          setIsEnterOtpModalVisible(false);
          navigate(Screen_Name.SetPassword_Screen);
        }}
      />
      {Loading && (
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
    paddingTop: 50,
  },
});

export default RegisterScreen;
