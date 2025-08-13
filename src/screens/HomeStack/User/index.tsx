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
import { IMAGES, link, message, text } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import { Spacing } from '../../../utils/spacing';
import {
  getCurrentUser,
  updateAvatar,
  updatePassword,
  updateUser,
} from '../../../service';
import moment from 'moment';
import AppInput from '../../../components/AppInput';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

interface Props {
  navigation: any;
}
const UserScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(moment().format('YYYY-MM-DD'));
  const [gender, setGender] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null); // Chứa URI ảnh chọn

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
  useEffect(() => {
    loadUserData();
  }, []);

  const handleUpdateUser = async () => {
    setLoading(true);
    const formData = new FormData();

    // Nếu có chọn ảnh, tải ảnh lên
    if (avatarBase64) {
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);
      try {
        const avatarResponse = await updateAvatar(formData); // Gọi API tải avatar lên
        console.log('Avatar uploaded', avatarResponse);
      } catch (error) {
        console.error('Error uploading avatar', error);
      }
    }

    try {
      // Cập nhật thông tin người dùng (kể cả avatar nếu cần)
      await updateUser(
        fullName,
        phoneNumber,
        address,
        new Date(dateOfBirth),
        gender,
        taxCode,
      );
      Toast.show({ type: 'success', text1: `${t(message.update_success)}` });
    } catch (error) {
      console.error('Error updating user info', error);
      Toast.show({ type: 'error', text1: `${t(message.update_failed)}` });
    } finally {
      setLoading(false);
    }

    // TODO: call API cập nhật user info
    Toast.show({ type: 'success', text1: `${t(message.update_success)}` });
    setIsEditing(false);
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImageUri(selectedImage.uri || '');
        setAvatarBase64(selectedImage.base64 || ''); // Lưu base64 nếu có
      }
    });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: `${t(message.not_match)}` });
      return;
    } else {
      const res = await updatePassword(oldPassword, newPassword);
    }

    // TODO: call API đổi mật khẩu
    Toast.show({ type: 'success', text1: `${t(message.change_password)}` });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePassword(false);
  };

  return (
    <View style={[styles.container]}>
      <NavBar title={t(text.user_info)} onPress={() => navigation.goBack()} />
      <ScrollView style={{ paddingTop: Spacing.medium }}>
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={pickImage}
          disabled={!isEditing}
        >
          <Image
            source={imageUri ? { uri: `${link.url}` } : IMAGES.avartar}
            style={[
              AppStyles.avartar,
              { width: 150, height: 150, resizeMode: 'cover' },
            ]}
          />
        </TouchableOpacity>
        <AppInput label={t(text.user)} value={email} editable={false} />
        <AppInput
          label={t(text.fullname)}
          placeholder={t(text.fullname)}
          value={fullName}
          onChangeText={text => setFullName(text)}
          editable={isEditing}
        />
        <AppInput
          label={t(text.address)}
          placeholder={t(text.address)}
          value={address}
          onChangeText={text => setAddress(text)}
          editable={isEditing}
        />
        <AppInput
          label={t(text.phone)}
          placeholder={t(text.phone)}
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          editable={isEditing}
        />
        <View>
          {!isEditing ? (
            <AppButton
              title={t(text.edit_info)}
              onPress={() => setIsEditing(true)}
            />
          ) : (
            <>
              <AppButton
                title={t(text.submit)}
                onPress={handleUpdateUser}
                customStyle={[{ marginBottom: Spacing.medium }]}
              />
              <AppButton
                title={t(text.cancel)}
                onPress={() => setIsEditing(false)}
              />
            </>
          )}
        </View>
        <View style={styles.divider} />
        <Text style={styles.title}>{t(message.change_password)}</Text>
        {changePassword ? (
          <>
            <AppInput
              label={t(text.old_password)}
              placeholder={t(text.old_password)}
              value={oldPassword}
              secureTextEntry={true}
              onChangeText={text => setOldPassword(text)}
            />
            <AppInput
              label={t(text.new_password)}
              placeholder={t(text.new_password)}
              value={newPassword}
              secureTextEntry={true}
              onChangeText={text => setNewPassword(text)}
            />
            <AppInput
              label={t(text.confirm_password)}
              placeholder={t(text.confirm_password)}
              value={confirmPassword}
              secureTextEntry={true}
              onChangeText={text => setConfirmPassword(text)}
            />
            <View>
              <AppButton
                title={t(message.change_password)}
                onPress={handleChangePassword}
                customStyle={[{ marginBottom: Spacing.medium }]}
              />
              <AppButton
                title={t(text.cancel)}
                onPress={() => setChangePassword(false)}
                customStyle={[{ marginBottom: Spacing.xxxxlarge }]}
              />
            </View>
          </>
        ) : (
          <AppButton
            title={t(message.change_password)}
            onPress={() => setChangePassword(true)}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
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
