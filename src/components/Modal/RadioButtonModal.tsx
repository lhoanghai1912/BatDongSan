// components/RadioButtonModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { Colors } from '../../utils/color';
import { Spacing } from '../../utils/spacing';
import { ICONS } from '../../utils/constants';
import AppStyles from '../AppStyle';
import AppButton from '../AppButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface Option {
  label: string;
  value: string;
}

interface RadioButtonModalProps {
  visible: boolean;
  title: string;
  data: Option[];
  selected: string;
  onClose: () => void;
  onSubmit: (selected: string) => void;
}

const RadioButtonModal: React.FC<RadioButtonModalProps> = ({
  visible,
  title,
  data,
  selected,
  onClose,
  onSubmit,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(selected);
  const [minInput, setMinInput] = useState('0');
  const [maxInput, setMaxInput] = useState(data?.[data.length - 2]?.value);
  const [sliderValue, setSliderValue] = useState(0);
  const max = Number(data?.[data.length - 2]?.value ?? 100); // fallback nếu không đủ data
  const [range, setRange] = useState<[number, number]>([0, max]);

  useEffect(() => {
    setSelectedValue(selected);
  }, [selected]);

  const formatPriceToTy = (price: number): string => {
    if (!price || isNaN(price)) return '0 triệu';

    // if (price >= 1_000_000_000) {
    //   return `${(price / 1_000_000_000).toFixed(2)} tỷ`;
    // }

    // if (price >= 1_000_000) {
    //   return `${(price / 1_000_000).toFixed(0)} triệu`;
    // }

    if (price >= 1_000) {
      return `${(price / 1_000).toFixed(0)} tỷ`;
    }

    return `${price.toFixed(0)} triệu`;
  };

  const handleSubmit = () => {
    onSubmit(selectedValue);
    onClose();
  };

  const handleReset = () => {
    setSelectedValue('');
  };

  // Khi slider thay đổi -> cập nhật input và range
  const handleSliderChange = (values: number[]) => {
    setRange([values[0], values[1]]);
    setMinInput(values[0].toString());
    setMaxInput(values[1].toString());
  };

  // Khi input thay đổi -> cập nhật slider (sau debounce)
  useEffect(() => {
    const min = parseInt(minInput) || 0;
    const max = parseInt(maxInput) || 0;

    if (min < max && max <= 10000) {
      setRange([min, max]);
    }
  }, [minInput, maxInput]);

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
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: Spacing.medium,
              marginTop: Spacing.medium,
            }}
          >
            {/* Text hiển thị giá trị */}
            <View style={styles.valueRow}>
              <Text style={styles.valueText}>
                Từ: {formatPriceToTy(range[0])} đồng
              </Text>
              <Text style={styles.valueText}>
                Đến: {formatPriceToTy(range[1])} đồng
              </Text>
            </View>

            {/* Nhập giá trị thủ công */}
            <View style={[styles.inputRow]}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minInput}
                onChangeText={setMinInput}
                placeholder="Tối thiểu"
              />
              <Text style={{ marginHorizontal: 8 }}>-</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={maxInput}
                onChangeText={setMaxInput}
                placeholder="Tối đa"
              />
            </View>

            {/* Thanh kéo */}
            <View style={{}}>
              <MultiSlider
                values={range}
                onValuesChange={handleSliderChange}
                min={0}
                max={60000}
                step={500}
                sliderLength={300}
                selectedStyle={{ backgroundColor: Colors.primary }}
                unselectedStyle={{ backgroundColor: Colors.lightGray }}
                markerStyle={{
                  backgroundColor: Colors.primary,
                  height: 20,
                  width: 20,
                }}
              />
            </View>
          </View>
          <View style={[AppStyles.line, { marginTop: 0, marginBottom: 0 }]} />
          <ScrollView style={styles.body}>
            {data.map((item, idx) => (
              <>
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedValue(item.value)}
                  style={styles.option}
                >
                  <Text style={[AppStyles.text, { color: Colors.black }]}>
                    {item.label}
                  </Text>
                  <Image
                    source={
                      selectedValue === item.value
                        ? ICONS.radio_checked
                        : ICONS.radio_unchecked
                    }
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
                <View style={[AppStyles.line, { marginTop: Spacing.medium }]} />
              </>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={AppStyles.line} />
            <View style={styles.buttonWrap}>
              <View style={{ width: '40%' }}>
                <AppButton
                  title="Đặt lại"
                  disabled={selectedValue.length === 0}
                  onPress={() => handleReset()}
                />
              </View>
              <View style={{ width: '40%' }}>
                <AppButton title="Áp dụng" onPress={() => handleSubmit()} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RadioButtonModal;

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
    marginBottom: Spacing.medium,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  header: {
    backgroundColor: Colors.black,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    maxHeight: '100%',
    paddingHorizontal: Spacing.medium,
    marginVertical: Spacing.medium,
  },
  footer: { marginBottom: Spacing.medium },
  buttonWrap: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.medium,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rangeSection: {
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  rangeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.small,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginBottom: Spacing.small,
  },
  valueText: {
    fontSize: 16,
    color: Colors.darkGray,
  },
});
