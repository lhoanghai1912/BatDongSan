import React, { useEffect, useState } from 'react';
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
  type:
    | 'unit'
    | 'legal'
    | 'furniture'
    | 'housedirection'
    | 'balconydirection'
    | 'availableFrom'
    | 'electricityPrice'
    | 'waterPrice'
    | 'internetPrice';
}

const UnitSelectionModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  selectedValue,
  type,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (!visible) {
      setSelected(null); // Reset selected value when modal is closed
    }
  }, [visible]);

  const unitOptions: { label: string; value: string }[] = [
    { label: 'VND', value: '1' },
    { label: `${t(text.price_m2)}`, value: '2' },
    { label: `${t(text.deal)}`, value: '3' },
  ];

  const legalOptions: { label: string; value: string }[] = [
    { label: `${t(text.nothave)}`, value: '0' },
    { label: `${t(text.redbook)}`, value: '1' },
    { label: `${t(text.waiting)}`, value: '2' },
  ];

  const furnitureOptions: { label: string; value: string }[] = [
    { label: `${t(text.nothave)}`, value: '0' },
    { label: `${t(text.have)}`, value: '1' },
    { label: `${t(text.full)}`, value: '2' },
    { label: `${t(text.highClass)}`, value: '3' },
  ];

  const directionOptions: { label: string; value: string }[] = [
    { label: `${t(text.modal.direction.east)}`, value: '1' },
    { label: `${t(text.modal.direction.west)}`, value: '2' },
    { label: `${t(text.modal.direction.south)}`, value: '3' },
    { label: `${t(text.modal.direction.north)}`, value: '4' },
    { label: `${t(text.modal.direction.northeast)}`, value: '5' },
    { label: `${t(text.modal.direction.northeast)}`, value: '6' },
    { label: `${t(text.modal.direction.southeast)}`, value: '7' },
    { label: `${t(text.modal.direction.southwest)}`, value: '8' },
  ];
  const availableFromOptions: { label: string; value: string }[] = [
    { label: `${t(text.now)}`, value: '1' },
    { label: `${t(text.week)}`, value: '2' },
    { label: `${t(text.month)}`, value: '3' },
    { label: `${t(text.deal)}`, value: '4' },
  ];
  const priceOption: { label: string; value: string }[] = [
    { label: `${t(text.supplier)}`, value: '1' },
    { label: `${t(text.owner)}`, value: '2' },
    { label: `${t(text.deal)}`, value: '3' },
  ];

  let options: { label: string; value: string }[] = [];
  let headerText = '';

  switch (type) {
    case 'unit':
      options = unitOptions;
      headerText = t(text.modal.chooseUnit);
      break;

    case 'legal':
      options = legalOptions;
      headerText = t(text.legal);
      break;

    case 'furniture':
      options = furnitureOptions;
      headerText = t(text.furnishing);
      break;

    case 'housedirection':
      options = directionOptions;
      headerText = t(text.modal.chooseDirection);
      break;

    case 'balconydirection':
      options = directionOptions;
      headerText = t(text.modal.chooseDirection);
      break;

    case 'availableFrom':
      options = availableFromOptions;
      headerText = t(text.availableFrom);
      break;

    case 'electricityPrice':
      options = priceOption;
      headerText = t(text.electricityPrice);
      break;

    case 'waterPrice':
      options = priceOption;
      headerText = t(text.waterPrice);
      break;

    case 'internetPrice':
      options = priceOption;
      headerText = t(text.internetPrice);
      break;
    default:
      options = [];
  }

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
              {headerText}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={ICONS.clear} style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          <View style={AppStyles.line} />

          {/* Body */}
          <ScrollView contentContainerStyle={styles.body}>
            {options.map((option, index) => (
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
              disabled={!selected}
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
