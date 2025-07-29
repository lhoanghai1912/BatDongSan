import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Spacing } from '../../../utils/spacing';
import { Colors } from '../../../utils/color';
import { ICONS, IMAGES, link, text } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { Fonts } from '../../../utils/fontSize';
import { logout } from '../../../store/reducers/userSlice';
import AppButton from '../../../components/AppButton';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = () => {
  const { t } = useTranslation();

  const dispactch = useDispatch();
  const { userData: reduxUserData, token: reduxToken } = useSelector(
    (state: any) => state.user,
  );

  const [userData, setUserData] = useState(reduxUserData || null);
  const [token, setToken] = useState(reduxToken || '');

  const fetchUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedToken && storedUser) {
        setToken(storedToken); // Store token
        setUserData(JSON.parse(storedUser)); // Store user data
      } else {
        // If no data in AsyncStorage, use Redux data
        setToken(reduxToken);
        setUserData(reduxUserData);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (!reduxUserData) {
      // Khi `reduxUserData` chưa có thì mới fetch từ AsyncStorage
      fetchUserData();
    } else {
      setUserData(reduxUserData);
    }
  }, [reduxUserData]);

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
                {userData?.avatarUrl ? (
                  <Image
                    source={{ uri: `${link.url}${userData.avatarUrl}` }}
                    style={AppStyles.avartar}
                  />
                ) : (
                  <Image
                    source={IMAGES.avartar} // dùng avatar mặc định nếu null
                    style={AppStyles.avartar}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={[
                  AppStyles.title,
                  {
                    marginBottom: 0,
                    marginLeft: Spacing.medium,
                    color: Colors.black,
                  },
                ]}
              >
                {userData?.fullName || ''}
              </Text>
            </View>
            <View
              style={[
                styles.headerItem,
                {
                  flex: 1,
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
              marginBottom: Spacing.medium,
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
              title={text.login}
              onPress={() => navigate(Screen_Name.Login_Screen)}
            />
          </View>
        )}
        <View
          style={{
            marginTop: Spacing.medium,
            borderColor: Colors.lightGray,
            borderWidth: 1,
            marginBottom: Spacing.medium,
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
              {t(text.guide)}
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
              <Text style={AppStyles.text}>{t('faq')}</Text>
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
              <Text style={AppStyles.text}>{t('report_issue')}</Text>
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
              <Text style={AppStyles.text}> {t(text.about_us)}</Text>
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
              {t(text.regulations)}
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
              <Text style={AppStyles.text}>
                {' '}
                {t(text.terms_and_conditions)}
              </Text>
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
              <Text style={AppStyles.text}> {t(text.privacy_policy)}</Text>
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
              {t(text.account_management)}
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
              <Text style={AppStyles.text}>
                {' '}
                {t(text.notification_settings)}
              </Text>
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
              <Text style={AppStyles.text}>
                {t(text.delete_account_request)}
              </Text>
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
              <Text style={AppStyles.text}>{t(text.logout)}</Text>
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
            <Text style={AppStyles.text}>{t(text.business_registration)}</Text>
            <Text style={AppStyles.text}>{t(text.responsible_person)}</Text>
          </View>
          <View style={{ marginTop: Spacing.medium }}>
            <Text style={[AppStyles.label, { marginBottom: 0 }]}>
              {t(text.company_name)}
            </Text>
            <Text style={AppStyles.text}>{t(text.company_address)}</Text>
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
            {t(text.version)}
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
