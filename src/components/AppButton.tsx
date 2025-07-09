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
}

const AppButton: React.FC<AppButtonProps> = ({
  // key,
  onPress,
  title,
  customStyle = [],
  disabled,
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
      <Text
        style={[
          styles.buttonText,
          { color: disabled ? Colors.black : Colors.white },
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
});

export default AppButton;
