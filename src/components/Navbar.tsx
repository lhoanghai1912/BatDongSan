import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ICONS, IMAGES } from '../utils/constants';
import AppStyles from './AppStyle';
import { Fonts } from '../utils/fontSize';
import { Colors } from '../utils/color';
import { Spacing } from '../utils/spacing';

const NavBar = ({ title, onPress }: any) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={onPress}>
        <Image source={ICONS.back} style={[AppStyles.icon]}></Image>
      </TouchableOpacity>
      <Text style={styles.navTitle}>{title}</Text>
      <TouchableOpacity style={{ width: 30, height: 30 }}></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.small,
    paddingTop: 50,
  },
  navTitle: {
    fontSize: Fonts.xxlarge,
    color: Colors.black,
    paddingLeft: Spacing.large,
    fontWeight: '500',
  },
});

export default NavBar;
