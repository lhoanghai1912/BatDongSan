import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import NavBar from '../../../components/Navbar';
import { useSelector } from 'react-redux';
import { Spacing } from '../../../utils/spacing';
import { Colors } from '../../../utils/color';
import { ICONS, IMAGES } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';

const SettingScreen = () => {
  const { userData } = useSelector((state: any) => state.user);
  console.log('data', userData);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{ flexDirection: 'row', paddingHorizontal: Spacing.medium }}
        >
          <View style={styles.headerItem}>
            <TouchableOpacity
              onPress={() => {
                console.log('asbcawdawd');
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
              {userData.fullName}
            </Text>
          </View>
          <View
            style={[
              styles.headerItem,
              {
                flex: 2,
                justifyContent: 'flex-end',
                marginRight: Spacing.small,
              },
            ]}
          >
            <TouchableOpacity>
              <Image source={ICONS.noti} style={[AppStyles.icon]} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: Spacing.medium,
            borderColor: Colors.lightGray,
            borderWidth: 1,
          }}
        />
      </View>
      <View style={styles.body}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: 'red',
  },
  headerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingScreen;
