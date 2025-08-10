import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { ICONS } from '../utils/constants';
import AppStyles from './AppStyle';
import { Fonts } from '../utils/fontSize';
import { Colors } from '../utils/color';
import { Spacing } from '../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavBarProps {
  title?: string;
  onPress?: () => void;
  icon1?: any;
  icon2?: any;
  onRightPress1?: () => void;
  onRightPress2?: () => void;
  customStyle?: ViewStyle[];
}

const NavBar = ({
  title,
  onPress,
  icon1,
  icon2,
  onRightPress1,
  onRightPress2,
  customStyle = [],
}: NavBarProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.navBar, ...customStyle, { paddingTop: insets.top }]}>
      {/* Back button */}
      <TouchableOpacity onPress={onPress} style={styles.iconButton}>
        <Image source={ICONS.back} style={AppStyles.icon} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.navTitle} numberOfLines={1}>
        {title}
      </Text>

      {/* Right icons */}
      <View style={styles.rightIcons}>
        {icon1 && (
          <TouchableOpacity onPress={onRightPress1} style={styles.iconButton}>
            <Image
              source={icon1}
              style={[AppStyles.icon, { tintColor: Colors.black }]}
            />
          </TouchableOpacity>
        )}
        {icon2 && (
          <TouchableOpacity onPress={onRightPress2} style={styles.iconButton}>
            <Image source={icon2} style={[AppStyles.icon, {}]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navTitle: {
    flex: 1,
    fontSize: Fonts.xxlarge,
    color: Colors.black,
    fontWeight: '500',
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

export default NavBar;
