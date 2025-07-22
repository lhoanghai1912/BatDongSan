import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../utils/color';
import { Spacing } from '../../utils/spacing';
import { ICONS, text } from '../../utils/constants';
import AppStyles from '../AppStyle';
import AppButton from '../AppButton';
import { Fonts } from '../../utils/fontSize';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: { label: string; value: string }) => void;
  selectedValue?: { label: string; value: string };
}

const UnitSelectionModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  selectedValue,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<any>(selectedValue || null);

  const unitOptions = [
    { label: 'VND', value: '1' },
    { label: `${t(text.price_m2)}`, value: '2' },
    { label: `${t(text.deal)}`, value: '3' },
  ];

  const handleSubmit = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                AppStyles.title,
                { color: Colors.white, marginBottom: 0 },
              ]}
            >
              {t(text.modal.chooseUnit)}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={ICONS.clear} style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          <View style={AppStyles.line} />

          {/* Body */}
          <ScrollView contentContainerStyle={styles.body}>
            {unitOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.radioItem,
                  selected?.value === option.value && styles.radioItemSelected,
                ]}
                onPress={() => setSelected(option)}
              >
                <Text style={styles.radioLabel}>{option.label}</Text>
                {selected?.value === option.value && (
                  <Image source={ICONS.checked} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <AppButton
              title={t(text.cancel)}
              customStyle={[{ width: '40%' }]}
              onPress={onClose}
            />
            <AppButton
              title={t(text.accept)}
              customStyle={[{ width: '40%' }]}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.black,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.white,
  },
  body: {
    paddingHorizontal: Spacing.medium,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.small,
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 12,
    marginBottom: Spacing.small,
    justifyContent: 'space-between',
  },
  radioItemSelected: {
    borderColor: Colors.blue,
    backgroundColor: '#f5fbffff',
  },
  radioLabel: {
    flex: 1,
    marginLeft: Spacing.medium,
    fontSize: Fonts.normal,
    color: Colors.black,
  },
  checkIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.blue,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.medium,
  },
});

export default UnitSelectionModal;
