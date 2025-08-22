// src/components/AppButton.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Image,
  View,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '../utils/color';
import { Spacing } from '../utils/spacing';
import { Fonts } from '../utils/fontSize';
import { ICONS } from '../utils/constants';

interface AppButtonProps {
  // key?: number;
  onPress: () => void; // Hàm khi nhấn nút
  title?: string; // Tiêu đề nút
  customStyle?: ViewStyle[]; // Custom style cho nút
  disabled?: boolean;
  leftIcon?: ImageSourcePropType; // icon key trong ICONS
  textStyle?: TextStyle; // Custom style cho text
}

const AppButton: React.FC<AppButtonProps> = ({
  // key,
  onPress,
  title,
  customStyle = [],
  disabled,
  leftIcon,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      // key={key}
      disabled={disabled}
      onPress={onPress}
      style={[
        disabled ? styles.buttonDisabled : styles.button,
        ...customStyle,
        { opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <View style={leftIcon ? styles.contentWrapper : ''}>
        {leftIcon && (
          <Image source={leftIcon} style={styles.icon} resizeMode="contain" />
        )}

        <Text
          numberOfLines={1} // Cắt tên khi quá dài
          ellipsizeMode="tail" // Hiển thị ba chấm
          style={[
            styles.buttonText,
            { color: disabled ? Colors.black : Colors.white },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  //Button
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.button,
    borderRadius: 30,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  buttonDisabled: {
    color: Colors.black,
    backgroundColor: Colors.buttonDisable,
    borderRadius: 30,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Fonts.normal,
    fontWeight: 500,

    textAlign: 'center',
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: Spacing.small,
    tintColor: Colors.white,
  },
});

export default AppButton;
