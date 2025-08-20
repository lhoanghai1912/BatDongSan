import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import AppButton from '../AppButton';
import Toast from 'react-native-toast-message';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import { enterOtp, otp_ResetPassword_Verify } from '../../service';
import { useDispatch } from 'react-redux';
import { setVerificationToken } from '../../store/reducers/userSlice';
import { message, text } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

interface EnterOtpProp {
  visible: boolean;
  onClose: () => void;
  onSuccess: (otpString: string) => void;
  contact: string;
  api: string;
}

const EnterOtpModal: React.FC<EnterOtpProp> = ({
  visible,
  onClose,
  onSuccess,
  contact,
  api,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Lưu trữ 6 ký tự OTP
  const [error, setError] = useState(false); // Lỗi nếu mã OTP không hợp lệ
  const lastValueRef = useRef(['', '', '', '', '', '']);

  // Tạo refs cho từng ô nhập OTP
  const inputRefs = useRef<Array<TextInput | null>>([]);
  useEffect(() => {
    if (visible) {
      setOtp(['', '', '', '', '', '']); // Reset về rỗng mỗi khi mở modal
      setError(false); // Reset lỗi nếu có
    }
  }, [visible]);
  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus tiếp theo nếu nhập xong
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    console.log('otpString', otpString);

    if (otpString.length === 6) {
      try {
        console.log('📤 Gửi OTP verify:', {
          contact,
          otp: otpString,
        });
        if (api === 'register') {
          const otpRes = await enterOtp(contact, otpString);
          dispatch(
            setVerificationToken({
              verificationToken: otpRes.verificationToken,
            }),
          );
          console.log('otpRes', otpRes);
        } else if (api === 'forgot_password') {
          console.log('Gửi OTP xác thực quên mật khẩu:', {
            contact,
            otp: otpString,
          });
          const otpRes = await otp_ResetPassword_Verify(contact, otpString);
          console.log('otpRes', otpRes);
        }

        onSuccess(otpString);
      } catch (error) {
        console.log('error', error);
      }
    } else {
      setError(true); // Nếu mã OTP không hợp lệ, hiển thị lỗi
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          // alignItems: 'center',
          backgroundColor: 'rgba(52, 52, 52,0.5)',
          paddingHorizontal: 13,
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t(text.enter_otp)}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={`otp-${index}`}
                style={[styles.otpInput, error && styles.errorInput]}
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={ref => {
                  inputRefs.current[index] = ref;
                }} // Gán ref cho từng ô
                autoFocus={index === 0} // Tự động focus vào ô đầu tiên
              />
            ))}
          </View>

          {error && (
            <Text style={styles.errorText}>{t(message.otp_error)}</Text>
          )}
          <View
            style={{
              marginVertical: 9,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignSelf: 'center',
              width: '95%',
            }}
          >
            <AppButton
              title="Hủy bỏ"
              onPress={onClose}
              customStyle={[{ width: '30%' }]}
            />
            <AppButton
              title="Xác nhận"
              onPress={handleSubmit}
              customStyle={[{ width: '30%' }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 5,
    marginLeft: 9,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EnterOtpModal;
