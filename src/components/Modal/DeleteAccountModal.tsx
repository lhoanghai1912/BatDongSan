import React, { useCallback } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/color';
import { Spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';
import { useTranslation } from 'react-i18next';
import { message, text } from '../../utils/constants';

interface DeleteAccountModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {t(message.delete_account_confirm_title)}
          </Text>
          <Text style={styles.message}>
            {t(message.delete_account_confirm_message)}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>{t(text.cancel)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>{t(text.submit)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.large,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
    color: Colors.black,
    textAlign: 'center',
  },
  message: {
    fontSize: Fonts.normal,
    color: Colors.darkGray,
    marginBottom: Spacing.large,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    padding: Spacing.medium,
    borderRadius: 8,
    marginRight: Spacing.small,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.red,
    padding: Spacing.medium,
    borderRadius: 8,
    marginLeft: Spacing.small,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: Fonts.normal,
  },
  confirmText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.normal,
  },
});

export default DeleteAccountModal;
