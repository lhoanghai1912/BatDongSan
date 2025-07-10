import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { ICONS, IMAGES, TITLES } from '../../utils/constants';
import AppStyles from '../../components/AppStyle';
import AppInput from '../../components/AppInput';
import { Spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';
import { Colors } from '../../utils/color';
import AppButton from '../../components/AppButton';
import { Screen_Name } from '../../navigation/ScreenName';
import { navigate } from '../../navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/reducers/userSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();

  const [username, setUserName] = useState('lhoanghai');
  const [password, setPassWord] = useState('1234Ab@');
  const [checked, setchecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const token = '123';
    dispatch(setToken({ token }));
  };
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
          {TITLES.login}
        </Text>
        <Text style={[AppStyles.text, { textAlign: 'center' }]}>
          {TITLES.welcome}
        </Text>
      </View>
      <View>
        <AppInput
          leftIcon={ICONS.username}
          placeholder="Nhập SDT chính hoặc email"
          onChangeText={setUserName}
          value={username}
        ></AppInput>
        <AppInput
          leftIcon={ICONS.password}
          placeholder="Nhập mật khẩu"
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
            Nhớ tài khoản
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: Fonts.small,
              textDecorationLine: 'underline',
              color: Colors.red,
              fontWeight: 'bold',
            }}
          >
            Quên mật khẩu
          </Text>
        </View>
      </View>
      <View style={{ marginBottom: Spacing.xlarge }}>
        <AppButton
          title={TITLES.login}
          onPress={() => handleLogin()}
          disabled={!username || !password}
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
          Hoặc đăng nhập với
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
        <Text style={AppStyles.text}>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigate(Screen_Name.Register_Screen)}>
          <Text
            style={[
              AppStyles.text,
              { color: Colors.red, textDecorationLine: 'underline' },
            ]}
          >
            Đăng kí
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
          Bằng việc tiếp tục, bạn đồng ý với{' '}
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
            Điều khoản sử dụng
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
            Chính sách bảo mật
          </Text>
          ,{' '}
          <Text
            onPress={() =>
              Linking.openURL(
                'https://trogiup.batdongsan.com.vn/docs/quy-che-hoat-dong',
              )
            }
            style={{
              color: Colors.black,
              fontWeight: '500',
              fontSize: Fonts.small,
              textDecorationLine: 'underline',
            }}
          >
            Quy chế
          </Text>
          ,{' '}
          <Text
            onPress={() =>
              Linking.openURL('https://trogiup.batdongsan.com.vn/')
            }
            style={{
              color: Colors.black,
              fontWeight: '500',
              fontSize: Fonts.small,
              textDecorationLine: 'underline',
            }}
          >
            Chính sách
          </Text>{' '}
          của chúng tôi.
        </Text>
      </View>
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
