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
  onReset: () => void;
  onSubmit: (selected: string) => void;
  isSingleValue?: boolean;
}

const RadioButtonModal: React.FC<RadioButtonModalProps> = ({
  visible,
  title,
  data,
  selected,
  onClose,
  onReset,
  onSubmit,
  isSingleValue = false,
}) => {
  const extractMaxValue = (): number => {
    const values = data
      .map(d => d.value.split('-')[1])
      .map(Number)
      .filter(v => !isNaN(v));

    return Math.max(...values, 1000); // giới hạn tối đa 1000 m²
  };

  const maxValue = extractMaxValue();

  const parseRangeFromString = (value: string): [number, number] => {
    const parts = value.split('-').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [min, max] = parts;
      return [
        Math.round((min / maxValue) * 100), // Tính tỷ lệ phần trăm cho giá trị min
        Math.round((max / maxValue) * 100), // Tính tỷ lệ phần trăm cho giá trị max
      ];
    }
    return [0, 0];
  };

  const initialRange = parseRangeFromString(selected);
  const [selectedValue, setSelectedValue] = useState<string>(selected);
  const [range, setRange] = useState<[number, number]>(initialRange);
  const [minInput, setMinInput] = useState(
    initialRange[0].toFixed(2).toString(),
  );
  const [sliderValue, setSliderValue] = useState<number>(
    isNaN(parseInt(selected)) ? 1 : parseInt(selected),
  );
  const [maxInput, setMaxInput] = useState(
    initialRange[1].toFixed(2).toString(),
  );
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setSelectedValue(selected);

    if (isSingleValue) {
      const val = parseInt(selected);
      if (!isNaN(val)) setSliderValue(val);
    } else {
      const [min, max] = selected.includes('-')
        ? selected.split('-')
        : ['0', '0'];
      const minValue = Number(min);
      const maxValue = Number(max);
      if (!isNaN(minValue) && !isNaN(maxValue)) {
        const totalMax = extractMaxValue();
        const minPercent = (minValue / totalMax) * 100;
        const maxPercent = (maxValue / totalMax) * 100;
        setRange([minPercent, maxPercent]);
        setMinInput(minValue.toString());
        setMaxInput(maxValue.toString());
      }
    }
  }, [selected, visible]); // 👈 rất quan trọng: thêm cả `visible`

  const handleSubmit = () => {
    if (isSingleValue) {
      onSubmit(sliderValue.toString());
    } else {
      if (range[0] === 0 && range[1] === 0) {
        onSubmit('');
        onClose();
        return;
      }
      const resultValue = `${minInput}-${maxInput}`;
      onSubmit(resultValue);
    }

    onClose();
  };

  const handleReset = () => {
    setRange([0, 0]);
    setMinInput('0');
    setMaxInput('0');
    onReset();
  };

  const handleSliderChange = (values: number[]) => {
    if (isSingleValue) {
      setSliderValue(values[0]);
      setSelectedValue(values[0].toString());
    } else {
      setRange([values[0], values[1]]);
      const realMin = ((values[0] / 100) * maxValue).toFixed(2);
      const realMax = ((values[1] / 100) * maxValue).toFixed(2);

      setMinInput(realMin);
      setMaxInput(realMax);
      setSelectedValue('');
    }
  };

  useEffect(() => {
    if (!isSingleValue) {
      const min = parseFloat(minInput);
      const max = parseFloat(maxInput);
      if (!isNaN(min) && !isNaN(max) && min < max && max <= maxValue) {
        setRange([(min / maxValue) * 100, (max / maxValue) * 100]);
      }
    }
  }, [minInput, maxInput]);

  const handleRadioSelected = (value: any) => {
    setSelectedValue(value);
    setHasChanged(true);

    if (isSingleValue) {
      const val = parseInt(value);
      if (!isNaN(val)) setSliderValue(val);
    } else {
      const [min, max] = value?.includes('-') ? value.split('-') : ['0', '0'];
      const minValue = Number(min); // Đảm bảo kiểu số
      const maxValue = Number(max); // Đảm bảo kiểu số
      if (!isNaN(minValue) && !isNaN(maxValue)) {
        const totalMax = extractMaxValue(); // giá trị lớn nhất thực tế trong danh sách data

        const minPercent = (minValue / totalMax) * 100;
        const maxPercent = (maxValue / totalMax) * 100;

        setRange([minPercent, maxPercent]);
        setMinInput(minValue.toString());
        setMaxInput(maxValue.toString());
      }
    }
  };
  console.log('selectedValue', selectedValue);

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
            <View style={styles.valueRow}>
              {isSingleValue ? (
                <Text style={styles.valueText}>Số phòng: {sliderValue}</Text>
              ) : (
                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>
                    Từ: {minInput} {title.includes('giá') ? 'tỷ đồng' : 'm²'}
                  </Text>
                  <Text style={styles.valueText}>
                    Đến: {maxInput} {title.includes('giá') ? 'tỷ đồng' : 'm²'}
                  </Text>
                </View>
              )}
            </View>
            {!isSingleValue && (
              <View style={styles.inputRow}>
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
            )}

            <View>
              <MultiSlider
                values={isSingleValue ? [sliderValue] : range}
                onValuesChange={handleSliderChange}
                min={isSingleValue ? 1 : 0}
                max={isSingleValue ? 5 : 100}
                step={isSingleValue ? 1 : 0.1}
                sliderLength={300}
                allowOverlap={false}
                snapped
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
              <React.Fragment key={idx}>
                <TouchableOpacity
                  onPress={() => handleRadioSelected(item.value)}
                  style={styles.option}
                >
                  <Text style={[AppStyles.text, { color: Colors.black }]}>
                    {item.label}
                  </Text>
                  <Image
                    source={
                      isSingleValue
                        ? sliderValue.toString() === item.value
                          ? ICONS.radio_checked
                          : ICONS.radio_unchecked
                        : (() => {
                            const [min, max] = item.value?.includes('-')
                              ? item.value.split('-')
                              : ['0', '0'];
                            const [curMin, curMax] = range.map(val =>
                              Math.round((val / 100) * maxValue),
                            );
                            return Number(min) === curMin &&
                              Number(max) === curMax
                              ? ICONS.radio_checked
                              : ICONS.radio_unchecked;
                          })()
                    }
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
                <View style={[AppStyles.line, { marginTop: Spacing.medium }]} />
              </React.Fragment>
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
