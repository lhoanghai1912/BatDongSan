// src/components/Modal/CheckBoxModal.tsx - Component checkbox modal mới đơn giản

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
import { ICONS, text } from '../../utils/constants';
import AppStyles from '../AppStyle';
import AppButton from '../AppButton';
import { useTranslation } from 'react-i18next';

// Interface cho option
interface Option {
  value: string;
  label: string;
  icon: string;
}

// Interface cho props
interface CheckBoxModalProps {
  visible: boolean;
  title: string;
  data: Option[];
  selected: string[];
  onClose: () => void;
  onReset: () => void;
  onSubmit: (selected: string[]) => void;
}

// Component chính
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
  const [localSelected, setLocalSelected] = useState<string[]>([]);

  // Cập nhật localSelected khi selected prop thay đổi
  useEffect(() => {
    setLocalSelected(selected || []);
  }, [selected]);

  // Toggle selection
  const toggleValue = (value: string) => {
    setLocalSelected(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Clear all selections
  const clearValue = () => {
    setLocalSelected([]);
    onReset();
  };

  // Submit selections
  const handleSubmit = () => {
    onSubmit(localSelected);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                AppStyles.label,
                { color: Colors.white, marginBottom: 0 },
              ]}
            >
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={ICONS.clear}
                style={[AppStyles.icon, { tintColor: Colors.white }]}
              />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView style={styles.body}>
            {data.map((item, index) => {
              const isChecked = localSelected.includes(item.value);
              return (
                <TouchableOpacity
                  key={item.value || index}
                  onPress={() => toggleValue(item.value)}
                  style={styles.option}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.labelContainer}>
                      <Image
                        source={item.icon as ImageSourcePropType}
                        style={AppStyles.icon}
                      />
                      <Text style={styles.optionLabel}>{item.label}</Text>
                    </View>
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

          {/* Footer */}
          <View style={styles.footer}>
            <View style={AppStyles.line} />
            <View style={styles.buttonWrap}>
              <View style={{ width: '40%' }}>
                <AppButton
                  title={t(text.reset)}
                  disabled={localSelected.length === 0}
                  onPress={clearValue}
                />
              </View>
              <View style={{ width: '40%' }}>
                <AppButton title={t(text.submit)} onPress={handleSubmit} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.medium,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  body: {
    maxHeight: 400,
    padding: Spacing.medium,
  },
  option: {
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    borderRadius: 8,
    marginBottom: Spacing.small,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLabel: {
    marginLeft: Spacing.small,
    fontSize: 16,
    color: Colors.black,
  },
  checkboxContainer: {
    marginLeft: Spacing.small,
  },
  footer: {
    padding: Spacing.medium,
  },
  buttonWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.small,
  },
});

export default CheckBoxModal;
