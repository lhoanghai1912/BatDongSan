import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Colors } from '../../utils/color';
import { useTranslation } from 'react-i18next';
import { ICONS, text } from '../../utils/constants';
import AppButton from '../AppButton';
import { Spacing } from '../../utils/spacing';
import AppStyles from '../AppStyle';
import { getSortData } from '../../screens/HomeStack/Home/houseType_data';

type Option = {
  label: string;
  value: string;
};

type SortModalProps = {
  visible: boolean; // Trạng thái hiển thị
  selected: { label: string; value: string }; // Cập nhật kiểu dữ liệu của selected
  onSelect: (values: { label: string; value: string }) => void; // Callback khi chọn
  onClose: () => void; // Đóng modal
};

const SortModal: React.FC<SortModalProps> = ({
  visible,
  selected,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();

  const options: Option[] = getSortData(t);
  // Đảm bảo selected là string (tên mặc định)
  const [checked, setChecked] = useState<{ label: string; value: string }>(
    selected,
  );
  useEffect(() => {
    setChecked(selected); // Đảm bảo rằng khi ngôn ngữ thay đổi, selected cũng được cập nhật lại
  }, [selected, visible]);

  const handleSelect = (opt: Option) => {
    setChecked(opt); // Chỉ lưu 1 giá trị duy nhất
  };

  const handleReset = () => {
    onSelect({ value: '', label: '' });
    onClose();
  };

  const handleSubmit = () => {
    // Truyền cả label và value cho parent
    onSelect(checked);
    onClose(); // Đóng modal sau khi chọn
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View
            style={{
              backgroundColor: Colors.black,
              paddingHorizontal: Spacing.medium,
              paddingVertical: 5,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={[AppStyles.label, { color: Colors.white }]}>
              {t(text.sort)}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={ICONS.clear}
                style={[AppStyles.icon, { tintColor: Colors.white }]}
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            {options.map((opt, index) => (
              <TouchableOpacity
                key={`${opt.value}-${index}`} // Ensure the key is unique by appending the index
                style={styles.item}
                onPress={() => handleSelect(opt)} // Lưu đối tượng opt
              >
                <Text style={styles.label}>{opt.label}</Text>
                <RadioButton
                  value={opt.value}
                  status={checked.value === opt.value ? 'checked' : 'unchecked'}
                  onPress={() => handleSelect(opt)} // Lưu đối tượng opt
                  color={Colors.black || '#E53935'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: Spacing.medium,
            }}
          >
            <AppButton
              title={t(text.reset)}
              customStyle={[{ width: '40%' }]}
              onPress={handleReset}
            />
            <AppButton
              title={t(text.submit)}
              customStyle={[{ width: '40%' }]}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SortModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});
