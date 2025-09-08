// components/CheckBoxModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '../../utils/color';
import { Spacing } from '../../utils/spacing';
import { ICONS, IMAGES, text } from '../../utils/constants';
import AppStyles from '../AppStyle';
import AppButton from '../AppButton';
import { HOUSE_TYPE_CATEGORY_MAP } from '../../screens/HomeStack/Home/houseType_data';
import { useTranslation } from 'react-i18next';
interface Option {
  value: string;
  label: string;
  icon: string;
}
interface CheckBoxModalProps {
  visible: boolean;
  title: string;
  data: Option[];
  selected: string[];
  onClose: () => void;
  onReset: () => void;
  onSubmit: (selected: string[]) => void;
}

const CheckBoxModal: React.FC<CheckBoxModalProps> = ({
  visible,
  title,
  data,
  selected,
  onClose,
  onReset,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [localSelected, setLocalSelected] = useState<string[]>(selected);

  useEffect(() => {
    setLocalSelected(selected);
  }, [selected]);

  const toggleValue = (value: string) => {
    setLocalSelected(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value],
    );
  };

  const clearValue = () => {
    setLocalSelected([]);
    onReset();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text
              style={[
                AppStyles.label,
                { color: Colors.white, marginBottom: 0 },
              ]}
            >
              {title}
            </Text>
            <TouchableOpacity onPress={() => onClose()}>
              <Image
                source={ICONS.clear}
                style={[AppStyles.icon, { tintColor: Colors.white }]}
              />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.body}> */}
          <ScrollView style={styles.body}>
            {data.map((item, idx) => {
              const isChecked = localSelected.includes(item.value);
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => toggleValue(item.value)}
                  style={styles.option}
                >
                  <View style={styles.optionContent}>
                    {/* Left side: icon + label */}
                    <View style={styles.labelContainer}>
                      {/* Nếu có icon bạn thêm vào đây: */}
                      <Image
                        source={item.icon as ImageSourcePropType}
                        style={AppStyles.icon}
                      />
                      <Text style={styles.optionLabel}>{item.label}</Text>
                    </View>

                    {/* Right side: checkbox */}
                    <View style={styles.checkboxContainer}>
                      <Image
                        source={isChecked ? ICONS.checked : ICONS.unchecked}
                        style={AppStyles.icon}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {/* </View> */}
          <View style={styles.footer}>
            <View style={AppStyles.line} />
            <View style={styles.buttonWrap}>
              <View style={{ width: '40%' }}>
                <AppButton
                  title={t(text.reset)}
                  disabled={localSelected.length === 0}
                  onPress={() => clearValue()}
                />
              </View>
              <View style={{ width: '40%' }}>
                <AppButton
                  title={t(text.submit)}
                  onPress={() => {
                    console.log('selected value:', localSelected);

                    onSubmit(localSelected), onClose();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CheckBoxModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  option: {
    paddingVertical: Spacing.small,
  },
  submit: {
    backgroundColor: Colors.primary,
    padding: Spacing.medium,
    marginTop: Spacing.medium,
    borderRadius: 8,
  },
  submitText: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.small,
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  optionLabel: {
    fontSize: 16,
    color: Colors.black,
    marginLeft: 8, // nếu có icon, cách icon 1 chút
  },

  checkboxContainer: {
    width: 32,
    alignItems: 'flex-end',
  },

  checkboxText: {
    fontSize: 20,
    color: Colors.primary,
  },
  header: {
    backgroundColor: Colors.black,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: { height: '80%', paddingHorizontal: Spacing.medium },
  footer: { marginBottom: Spacing.medium },
  buttonWrap: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.medium,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
