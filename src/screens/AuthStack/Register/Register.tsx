import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Spacing } from '../../../utils/spacing';
import { ICONS, IMAGES, TITLES } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { Colors } from '../../../utils/color';
import { Fonts } from '../../../utils/fontSize';

const RegisterScreen = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    console.log('register pressed');
    navigate(Screen_Name.SetPassword_Screen);
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
          {TITLES.register}
        </Text>
        <Text style={[AppStyles.text, { textAlign: 'center' }]}>
          Tạo tài khoản mới
        </Text>
      </View>

      <View>
        <AppInput
          leftIcon={ICONS.username}
          placeholder="Nhập số điện thoại hoặc email"
          onChangeText={setUserName}
          value={username}
        />
      </View>

      <View style={{ marginBottom: Spacing.xlarge }}>
        <AppButton
          title="Tiếp tục"
          onPress={handleRegister}
          disabled={username.length <= 10}
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
          Hoặc đăng kí với
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
        <Text style={AppStyles.text}>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigate(Screen_Name.Login_Screen)}>
          <Text
            style={[
              AppStyles.text,
              { color: Colors.red, textDecorationLine: 'underline' },
            ]}
          >
            Đăng nhập
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
            { fontSize: Fonts.small, textAlign: 'center', color: Colors.Gray },
          ]}
        >
          Bằng việc tiếp tục, bạn đồng ý với{' '}
          <Text
            onPress={() => console.log('Điều khoản sử dụng')}
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
            onPress={() => console.log('Chính sách bảo mật')}
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
            onPress={() => console.log('Quy chế')}
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
            onPress={() => console.log('Chính sách')}
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
    paddingTop: 100,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.white,
  },
});

export default RegisterScreen;
