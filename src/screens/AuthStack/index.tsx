import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ICONS, TITLES } from '../../utils/constants';
import AppStyles from '../../components/AppStyle';
import AppInput from '../../components/AppInput';
import { Spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';

const LoginScreen = () => {
  const [username, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [checked, setchecked] = useState(false);
  console.log('checked', checked);

  return (
    <View style={styles.container}>
      <Text style={AppStyles.title}>{TITLES.login} </Text>
      <View>
        <AppInput
          placeholder="Nhập SDT chính hoặc email"
          onChangeText={setUserName}
          value={username}
        ></AppInput>
        <AppInput
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
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setchecked(!checked)}>
            <Image
              source={checked ? ICONS.checked : ICONS.unchecked}
              style={AppStyles.icon}
            />
          </TouchableOpacity>
          <Text style={[AppStyles.text, { marginLeft: Spacing.small }]}>
            Nhớ tài khoản
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: Fonts.small }}>Quên mật khẩu </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.medium,
  },
});

export default LoginScreen;
