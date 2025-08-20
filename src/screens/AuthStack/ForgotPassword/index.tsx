import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import AppStyles from '../../../components/AppStyle';
import AppButton from '../../../components/AppButton';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../utils/color';
import { Spacing } from '../../../utils/spacing';
import { Screen_Name } from '../../../navigation/ScreenName';
import { navigate } from '../../../navigation/RootNavigator';
import EnterOtpModal from '../../../components/Modal/EnterOtpModal';
import { forgotPassword } from '../../../service';
import { ActivityIndicator } from 'react-native-paper';
import NavBar from '../../../components/Navbar';
import { IMAGES, message, text } from '../../../utils/constants';
import AppInput from '../../../components/AppInput';

const ForgotPasswordScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [isEnterOtpModalVisible, setIsEnterOtpModalVisible] = useState(false);
  const [resetContact, setResetContact] = useState(''); // giữ contact từ OTPModal
  const [resetOtp, setResetOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState('');

  console.log(contact);
  console.log(resetOtp);

  const handleSendOtp = async () => {
    if (!contact) {
      Toast.show({ type: 'error', text1: t(message.enter_userName) });
      return;
    }
    // Gửi OTP về số điện thoại/email
    try {
      setLoading(true);
      const response = await forgotPassword(contact);
      console.log(response);
      setLoading(false);
      setIsEnterOtpModalVisible(true);
      setResetContact(contact);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar title={t(text.forgot)} onPress={() => navigation.goBack()} />
      <View style={{ paddingBottom: Spacing.xlarge }}>
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

      <View style={{}}>
        <AppInput
          label={t(message.enter_userName)}
          placeholder={t(message.enter_userName)}
          value={contact}
          onChangeText={setContact}
        />
        <AppButton title={t(text.submit)} onPress={handleSendOtp} />

        <EnterOtpModal
          visible={isEnterOtpModalVisible}
          onClose={() => setIsEnterOtpModalVisible(false)}
          contact={resetContact}
          api="forgot_password"
          onSuccess={otp => {
            setResetOtp(otp);
            setIsEnterOtpModalVisible(false);
            navigate(Screen_Name.SetPassword_Screen, {
              source: 'forgot',
              contact,
              otp,
            });
          }}
        />
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
    padding: Spacing.large,
    backgroundColor: Colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: Spacing.medium,
    marginVertical: Spacing.medium,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.large,
    alignItems: 'center',
    width: '80%',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Spacing.large,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    marginHorizontal: 6,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: Colors.white,
  },
});

export default ForgotPasswordScreen;
