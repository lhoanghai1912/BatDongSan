// components/ButtonModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Spacing } from '../../utils/spacing';
import { Colors } from '../../utils/color';

interface ButtonModalProps {
  visible: boolean;
  title: string;
  data: string[];
  selected: string;
  onClose: () => void;
  onSubmit: (selected: string) => void;
}

const ButtonModal: React.FC<ButtonModalProps> = ({
  visible,
  title,
  data,
  selected,
  onClose,
  onSubmit,
}) => {
  const [selectedValue, setSelectedValue] = useState(selected);

  useEffect(() => {
    setSelectedValue(selected);
  }, [selected]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.buttonGroup}>
            {data.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.button,
                  selectedValue === item && styles.buttonSelected,
                ]}
                onPress={() => setSelectedValue(item)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedValue === item && styles.buttonTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.submit}
            onPress={() => {
              onSubmit(selectedValue);
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

export default ButtonModal;

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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.Gray,
    borderRadius: 20,
    marginRight: Spacing.small,
    marginBottom: Spacing.small,
  },
  buttonSelected: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.black,
  },
  buttonTextSelected: {
    color: Colors.white,
    fontWeight: 'bold',
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
