// components/CheckBoxModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../../utils/color';
import { Spacing } from '../../utils/spacing';

interface CheckBoxModalProps {
  visible: boolean;
  title: string;
  data: string[];
  selected: string[];
  onClose: () => void;
  onSubmit: (selected: string[]) => void;
}

const CheckBoxModal: React.FC<CheckBoxModalProps> = ({
  visible,
  title,
  data,
  selected,
  onClose,
  onSubmit,
}) => {
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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView>
            {data.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => toggleValue(item)}
                style={styles.option}
              >
                <Text style={{ color: Colors.black }}>
                  {localSelected.includes(item) ? '☑' : '☐'} {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.submit}
            onPress={() => {
              onSubmit(localSelected);
              onClose();
            }}
          >
            <Text style={styles.submitText}>Áp dụng</Text>
          </TouchableOpacity>
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
    padding: Spacing.medium,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
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
});
