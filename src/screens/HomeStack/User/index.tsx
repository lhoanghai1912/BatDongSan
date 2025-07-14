import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { Colors } from '../../../utils/color';
import AppButton from '../../../components/AppButton';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import NavBar from '../../../components/Navbar';
import { IMAGES } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import { Spacing } from '../../../utils/spacing';
import { getCurrentUser, updatePassword, updateUser } from '../../../service';
import moment from 'moment';
import AppInput from '../../../components/AppInput';

interface Props {
  navigation: any;
}
const UserScreen: React.FC<Props> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(moment().format('YYYY-MM-DD'));
  const [gender, setGender] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await getCurrentUser();
        setFullName(res.fullName);
        setEmail(res.email);
        setPhoneNumber(res.phoneNumber);
        setAddress(res.address);

        console.log('userData', res);
      } catch (error) {
        console.log('erro', error);
      }
    };
    loadUserData();
  }, []);

  const handleSaveInfo = async () => {
    console.log('abc');
    const res = await updateUser(
      fullName,
      phoneNumber,
      address,
      new Date(dateOfBirth),
      gender,
      avatarBase64,
    );

    // TODO: call API cập nhật user info
    Toast.show({ type: 'success', text1: 'Cập nhật thành công' });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Mật khẩu xác nhận không khớp' });
      return;
    } else {
      const res = await updatePassword(oldPassword, newPassword);
    }

    // TODO: call API đổi mật khẩu
    Toast.show({ type: 'success', text1: 'Đổi mật khẩu thành công' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePassword(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NavBar
        title="Thông tin khách hàng"
        onPress={() => navigation.goBack()}
      />
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <Image
          source={IMAGES.avartar}
          style={[AppStyles.avartar, { width: 150, height: 150 }]}
        />
      </TouchableOpacity>
      <AppInput label="Tên đăng nhập" value={email} editable={false} />
      <AppInput
        label="Họ và tên"
        placeholder="Nhập họ và tên"
        value={fullName}
        onChangeText={text => setFullName(text)}
        editable={isEditing}
      />
      <AppInput
        label="Địa chỉ"
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={text => setAddress(text)}
        editable={isEditing}
      />
      <View style={styles.buttonGroup}>
        {!isEditing ? (
          <AppButton
            title="Chỉnh sửa thông tin"
            onPress={() => setIsEditing(true)}
          />
        ) : (
          <>
            <AppButton
              title="Lưu thông tin"
              onPress={handleSaveInfo}
              customStyle={[{ marginBottom: Spacing.medium }]}
            />
            <AppButton title="Hủy" onPress={() => setIsEditing(false)} />
          </>
        )}
      </View>
      <View style={styles.divider} />
      <Text style={styles.title}>Đổi mật khẩu</Text>
      {changePassword ? (
        <>
          <AppInput
            label="Mật khẩu cũ"
            placeholder="Nhập mật khẩu cũ"
            value={oldPassword}
            secureTextEntry={true}
            onChangeText={text => setOldPassword(text)}
          />
          <AppInput
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            secureTextEntry={true}
            onChangeText={text => setNewPassword(text)}
          />
          <AppInput
            label="Xác nhận mật khẩu "
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
          />
          <View style={styles.buttonGroup}>
            <AppButton
              title="Đổi mật khẩu"
              onPress={handleChangePassword}
              customStyle={[{ marginBottom: Spacing.medium }]}
            />
            <AppButton title="Hủy" onPress={() => setChangePassword(false)} />
          </View>
        </>
      ) : (
        <AppButton
          title="Đổi mật khẩu"
          onPress={() => setChangePassword(true)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.black,
  },
  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
    color: Colors.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  buttonGroup: {
    marginTop: 20,
    marginBottom: 10,
  },
  cancelText: {
    color: Colors.red,
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 30,
  },
});
export default UserScreen;
