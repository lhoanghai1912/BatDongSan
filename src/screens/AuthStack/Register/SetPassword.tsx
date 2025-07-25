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
import { ICONS, IMAGES, text } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import { Spacing } from '../../../utils/spacing';
import AppButton from '../../../components/AppButton';
import { Colors } from '../../../utils/color';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import { Screen_Name } from '../../../navigation/ScreenName';
import NavBar from '../../../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserData } from '../../../store/reducers/userSlice';
import { create_password } from '../../../service';
interface Props {
  navigation: any;
}
const SetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.user);

  const { verificationToken } = useSelector((state: any) => state.user);
  const [password, SetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  const isMatch = password === confirmPassword;
  const isValid = hasMinLength && hasUpperCase && hasNumber;

  const handleRegister = async () => {
    if (!isMatch) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Mật khẩu và xác nhận mật khẩu chưa trùng khớp',
      });
    } else {
      try {
        setLoading(true);
        // Giả định bạn có username/email ở biến tạm, ví dụ hardcoded hoặc truyền props
        const res = await create_password(
          verificationToken,
          password,
          confirmPassword,
        );
        console.log('output', res);

        dispatch(setToken({ token: res.user.token }));

        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Tài khoản đã được tạo và đăng nhập thành công',
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  console.log('token', token);

  return (
    <View style={[styles.container]}>
      <NavBar title={'Tạo mật khẩu'} onPress={() => navigation.goBack()} />
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
          label="Mật khẩu"
          leftIcon={ICONS.password}
          placeholder="Nhập số mật khẩu"
          onChangeText={SetPassword}
          secureTextEntry={true}
          value={password}
        />
      </View>
      <View>
        <AppInput
          label="Xác nhận mật khẩu"
          leftIcon={ICONS.password}
          placeholder="Xác nhận mật khẩu"
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
            Mật khẩu tối thiểu 8 ký tự
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
            Chứa ít nhất 1 ký tự viết hoa
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
            Chứa ít nhất 1 ký tự số
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
        <AppButton
          title="Đăng ký"
          onPress={handleRegister}
          disabled={!password || !confirmPassword || !isValid}
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
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.white,
  },
});

export default SetPasswordScreen;
