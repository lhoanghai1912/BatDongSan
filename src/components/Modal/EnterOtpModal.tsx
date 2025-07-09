import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppButton from '../AppButton';
import Toast from 'react-native-toast-message';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';

interface EnterOtpProp {
  visible: boolean;
  onClose: () => void;
  onSuccess: (otpString: string) => void;
  email: string;
}

const EnterOtpModal: React.FC<EnterOtpProp> = ({
  visible,
  onClose,
  onSuccess,
  email,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Lưu trữ 6 ký tự OTP
  const [error, setError] = useState(false); // Lỗi nếu mã OTP không hợp lệ
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho Loading
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
    const newOtp = [...otp];

    // if (text === '') {
    //   // Người dùng đang xóa → xử lý trong onKeyPress riêng
    //   return;
    // }

    if (newOtp[index] === '') {
      // Nếu ô đang trống → ghi vào
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 5) inputRefs.current[index + 1]?.focus();
    } else {
      // Nếu ô đang có → tìm ô trống phía sau
      const nextEmpty = newOtp.findIndex(
        (val, idx) => val === '' && idx > index,
      );
      if (nextEmpty !== -1) {
        newOtp[nextEmpty] = text;
        setOtp(newOtp);
        inputRefs.current[nextEmpty]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsLoading(true);
      navigate(Screen_Name.SetPassword_Screen);
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
          <Text style={styles.title}>Nhập mã OTP</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[styles.otpInput, error && styles.errorInput]}
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    const newOtp = [...otp];

                    if (otp[index] !== '') {
                      newOtp[index] = '';
                      setOtp(newOtp);
                    } else if (index > 0) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }
                }}
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
            <Text style={styles.errorText}>Mã OTP phải có 6 chữ số.</Text>
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
