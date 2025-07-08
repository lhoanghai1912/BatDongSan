// src/components/AppButton.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { Colors } from '../utils/color';
import { Spacing } from '../utils/spacing';
import { Fonts } from '../utils/fontSize';

interface AppButtonProps {
  // key?: number;
  onPress: () => void; // Hàm khi nhấn nút
  title: string; // Tiêu đề nút
  customStyle?: ViewStyle[]; // Custom style cho nút
  disabled?: boolean;
  select?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  // key,
  onPress,
  title,
  customStyle = [],
  disabled,
  select,
}) => {
  return (
    <TouchableOpacity
      // key={key}
      disabled={disabled}
      onPress={onPress}
      style={[
        disabled ? styles.buttonDisabled : styles.button,
        select === true ? styles.button : styles.notSelectedButton,
        ...customStyle,
        { opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          { color: disabled || select === false ? Colors.black : Colors.white },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  //Button
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    height: 50,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  notSelectedButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    height: 50,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buttonDisabled: {
    color: Colors.black,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Fonts.small,
    fontWeight: 500,
    textAlign: 'center',
  },
});

export default AppButton;
