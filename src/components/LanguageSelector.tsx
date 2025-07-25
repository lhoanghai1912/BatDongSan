// components/LanguageSelector.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Colors } from '../utils/color';
import { Spacing } from '../utils/spacing';

interface LanguageSelectorProps {
  visible: boolean;
  selectedLang: string;
  onSelect: (lang: string) => void;
  onClose: () => void;
}

const languages = [
  { label: '🇻🇳 Tiếng Việt', value: 'vi' },
  { label: '🇱🇦 ພາສາລາວ', value: 'lo' },
  { label: '🇬🇧 English', value: 'en' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  selectedLang,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Chọn ngôn ngữ</Text>
          {languages.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.option,
                item.value === selectedLang && styles.selected,
              ]}
              onPress={() => {
                onSelect(item.value);
                console.log(item.value);

                onClose();
              }}
            >
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: Colors.white }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: Spacing.large,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
  },
  option: {
    paddingVertical: Spacing.small,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: Spacing.small,
    backgroundColor: Colors.lightGray,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 16,
    color: Colors.black,
  },
  closeBtn: {
    marginTop: Spacing.medium,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
});
