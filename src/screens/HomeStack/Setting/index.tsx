import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import NavBar from '../../../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { Spacing } from '../../../utils/spacing';
import { Colors } from '../../../utils/color';
import { ICONS, IMAGES, TITLES } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { Fonts } from '../../../utils/fontSize';
import { logout } from '../../../store/reducers/userSlice';
import AppButton from '../../../components/AppButton';

const SettingScreen = () => {
  const dispactch = useDispatch();
  const { userData, token } = useSelector((state: any) => state.user);
  console.log('token11111111', token);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {token ? (
          <View
            style={{ flexDirection: 'row', paddingHorizontal: Spacing.medium }}
          >
            <View style={styles.headerItem}>
              <TouchableOpacity
                onPress={() => {
                  navigate(Screen_Name.User_Screen);
                }}
              >
                <Image source={IMAGES.avartar} style={AppStyles.avartar} />
              </TouchableOpacity>
              <Text
                style={[
                  AppStyles.title,
                  { marginBottom: 0, marginLeft: Spacing.medium },
                ]}
              >
                {userData?.fullName || ''}
              </Text>
            </View>
            <View
              style={[
                styles.headerItem,
                {
                  flex: 2,
                  justifyContent: 'flex-end',
                  marginRight: Spacing.medium,
                },
              ]}
            >
              <TouchableOpacity>
                <Image source={ICONS.noti} style={[AppStyles.icon]} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              borderRadius: 20,
              borderWidth: 0.5,
              borderColor: Colors.Gray,
              marginHorizontal: Spacing.medium,
              padding: Spacing.medium,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.apple}
                style={[AppStyles.icon, { marginRight: Spacing.small }]}
              />
              <Text
                style={[
                  AppStyles.text,
                  {
                    flex: 1, // Bắt buộc: cho phép chiếm phần còn lại
                    flexWrap: 'wrap', // Bắt dòng mới khi quá dài
                    minWidth: 0, // Tránh Text bị fix width 100%
                  },
                ]}
              >
                Đăng nhập tài khoản để xem thông tin và liên hệ người bán/ cho
                thuê
              </Text>
            </View>
            <AppButton
              title={TITLES.login}
              onPress={() => navigate(Screen_Name.Login_Screen)}
            />
          </View>
        )}
        <View
          style={{
            marginTop: Spacing.medium,
            borderColor: Colors.lightGray,
            borderWidth: 1,
          }}
        />
      </View>
      <View style={styles.body}>
        <ScrollView>
          <View>
            <Text
              style={{
                fontSize: Fonts.normal,
                fontWeight: 'bold',
                color: Colors.darkGray,
                marginBottom: Spacing.medium,
              }}
            >
              Hướng dẫn
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.question}
                style={{ width: 20, height: 20, marginRight: Spacing.medium }}
              />
              <Text style={AppStyles.text}>Câu hỏi thường gặp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.issue}
                style={{ width: 20, height: 20, marginRight: Spacing.medium }}
              />
              <Text style={AppStyles.text}>Góp ý báo lỗi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.about}
                style={{ width: 20, height: 20, marginRight: Spacing.medium }}
              />
              <Text style={AppStyles.text}>Về chúng tôi</Text>
            </TouchableOpacity>
            <View
              style={{
                borderColor: Colors.lightGray,
                borderWidth: 1,
                marginBottom: Spacing.medium,
              }}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: Fonts.normal,
                fontWeight: 'bold',
                color: Colors.darkGray,
                marginBottom: Spacing.medium,
              }}
            >
              Quy định
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.clause}
                style={{ width: 20, height: 20, marginRight: Spacing.medium }}
              />
              <Text style={AppStyles.text}>Điều khoản thỏa thuận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.privacy}
                style={{ width: 20, height: 20, marginRight: Spacing.medium }}
              />
              <Text style={AppStyles.text}>Chính sách bảo mật</Text>
            </TouchableOpacity>

            <View
              style={{
                borderColor: Colors.lightGray,
                borderWidth: 1,
                marginBottom: Spacing.medium,
              }}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: Fonts.normal,
                fontWeight: 'bold',
                color: Colors.darkGray,
                marginBottom: Spacing.medium,
              }}
            >
              Quản lý tài khoản
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.noti}
                style={{ width: 20, height: 20, marginRight: Spacing.medium }}
              />
              <Text style={AppStyles.text}>Cài đặt thông báo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.remove_user}
                style={{ width: 20, height: 20, marginRight: Spacing.medium }}
              />
              <Text style={AppStyles.text}>Yêu cầu xóa tài khoản</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dispactch(logout())}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
              }}
            >
              <Image
                source={ICONS.logout}
                style={{ width: 20, height: 20, marginRight: Spacing.medium }}
              />
              <Text style={AppStyles.text}>Đăng xuất</Text>
            </TouchableOpacity>
            <View
              style={{
                borderColor: Colors.lightGray,
                borderWidth: 1,
                marginBottom: Spacing.medium,
              }}
            />
          </View>
          <View>
            <Text style={AppStyles.text}>
              Giấy ĐKKD số 1209312 do Sở KHĐT TP Hà Nội cấp lần đầu ngày
              01/01/2025
            </Text>
            <Text style={AppStyles.text}>
              Chịu trách nghiệm sàn GDTMĐT: Ông ...
            </Text>
          </View>
          <View style={{ marginTop: Spacing.medium }}>
            <Text style={[AppStyles.label, { marginBottom: 0 }]}>
              CÔNG TY CỔ PHẦN ...
            </Text>
            <Text style={AppStyles.text}>
              Tầng 3, Chung cư N03-T3 Ngoại Giao Đoàn, Bắc Từ Liêm, Hà Nội
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => console.log('logo')}
            style={{ marginTop: Spacing.small }}
          >
            <Image
              source={IMAGES.bocongthuong}
              style={{
                width: 200,
                height: 80,
                // backgroundColor: 'red',
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <Text style={[AppStyles.text, { textAlign: 'center' }]}>
            Phiên bản 1.0
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  header: {
    flex: 0.2,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginTop: 50,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.white,
  },
  headerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingScreen;
