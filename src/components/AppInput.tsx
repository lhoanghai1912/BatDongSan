import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
  StyleProp,
  TextStyle,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import AppStyles from './AppStyle';
import { ICONS } from '../utils/constants';
import { Spacing } from '../utils/spacing';
import { Fonts } from '../utils/fontSize';
import { Colors } from '../utils/color';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: StyleProp<TextStyle>;
  leftIcon?: ImageSourcePropType;
}

const AppInput: React.FC<AppInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  label,
  error,
  leftIcon,
  editable = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false); // Trạng thái focus
  const [isShow, setIsShow] = useState(false);
  const handleShowHide = async () => {
    setIsShow(!isShow);
  };
  const handleFocus = () => {
    setIsFocused(true); // Đặt trạng thái khi trường được chọn
  };
  const handleClear = async () => {
    onChangeText?.('');
  };
  const handleBlur = () => {
    setIsFocused(false); // Đặt trạng thái khi trường không còn được chọn
  };
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <Image source={leftIcon} style={styles.leftIcon} />}
        <TextInput
          onFocus={handleFocus} // Khi trường được chọn
          onBlur={handleBlur} // Khi trường mất focus
          editable={editable}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isShow}
          keyboardType={keyboardType}
          style={[
            styles.input,
            style,
            error && styles.errorBorder,
            isFocused && styles.focusedInput,
            {
              paddingLeft: leftIcon ? Spacing.xxlarge : Spacing.small, // 🔥 padding động
            },
          ]}
          placeholderTextColor="#999"
          {...props}
        />
        {editable && (
          <>
            {secureTextEntry ? (
              <View style={AppStyles.iconGroup}>
                <TouchableOpacity onPress={handleShowHide}>
                  <Image
                    source={isShow ? ICONS.show : ICONS.hide}
                    style={[
                      AppStyles.icon,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  ></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClear}>
                  <Image
                    source={ICONS.clear}
                    style={[
                      AppStyles.icon,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  ></Image>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={AppStyles.iconSingle}>
                <TouchableOpacity onPress={handleClear}>
                  <Image
                    source={ICONS.clear}
                    style={[
                      AppStyles.icon,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  ></Image>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.medium,
    width: '100%',
  },
  label: {
    fontSize: Fonts.normal,
    marginBottom: Spacing.small,
    color: Colors.black,
    alignItems: 'center',
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    paddingHorizontal: Spacing.xxlarge,
    color: '#000',
    borderColor: Colors.Gray,
    borderWidth: 1,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    width: 25,
    height: 25,
    resizeMode: 'contain',
    zIndex: 1,
  },
  focusedInput: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingHorizontal: Spacing.medium,
    color: '#000',
    borderColor: Colors.black,
    borderWidth: 1,
  },
  errorBorder: {
    borderColor: '#ff5a5f',
  },
  errorText: {
    color: '#ff5a5f',
    fontSize: Fonts.small,
    marginTop: Spacing.small,
  },
});

export default AppInput;
