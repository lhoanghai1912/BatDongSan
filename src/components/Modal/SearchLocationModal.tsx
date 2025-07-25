import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Colors } from '../../utils/color';
import { Spacing } from '../../utils/spacing';
import { ICONS, text } from '../../utils/constants';
import AppButton from '../AppButton';
import AppStyles from '../AppStyle';
import { useTranslation } from 'react-i18next';
import AppInput from '../AppInput';
import PropertyLocationModal from './PropertyLocationModal';
import Toast from 'react-native-toast-message';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSearch: (location: any) => void;
}

type FieldType = 'province' | 'district' | 'commune';

const SearchLocationModal: React.FC<Props> = ({
  visible,
  onClose,
  onSearch,
}) => {
  const { t } = useTranslation();

  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationModalField, setLocationModalField] =
    useState<FieldType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    province: any;
    district: any;
    commune: any;
    street: string;
  }>({ province: null, district: null, commune: '', street: '' });

  const handleSubmit = () => {
    onSearch(selectedLocation);
    console.log(selectedLocation);

    onClose();
    setSelectedLocation({
      province: null,
      district: null,
      commune: '',
      street: '',
    });
  };

  const openLocationModal = (field: FieldType) => {
    if (field === 'district' && !selectedLocation.province) {
      alert('Vui lòng chọn Tỉnh/Thành trước');
      return;
    }
    if (field === 'commune' && !selectedLocation.district) {
      alert('Vui lòng chọn Quận/Huyện trước');
      return;
    }
    setLocationModalField(field);
    setLocationModalVisible(true);
  };

  const handleLocationSelect = (location: any) => {
    if (locationModalField === 'province') {
      setSelectedLocation({
        province: location,
        district: null,
        commune: '',
        street: '',
      });
    } else if (locationModalField === 'district') {
      setSelectedLocation(prev => ({
        ...prev,
        district: location,
        commune: '',
      }));
    } else if (locationModalField === 'commune') {
      setSelectedLocation(prev => ({ ...prev, commune: location }));
    }
    setLocationModalVisible(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerItem}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedLocation({
                    province: null,
                    district: null,
                    commune: null,
                    street: '',
                  }),
                    onClose();
                }}
              >
                <Image source={ICONS.back} style={styles.clearIcon} />
              </TouchableOpacity>
              <Text style={[AppStyles.title, { marginBottom: 0 }]}>
                {t(text.prop_location)}
              </Text>
              <TouchableOpacity style={{ width: 40, height: 40 }} />
            </View>
            <View style={AppStyles.line} />
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={[AppStyles.label, { marginBottom: Spacing.medium }]}>
              {t(text.pick_location)}
            </Text>
            <View style={{ width: '90%' }}>
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.pick_location)}
              </Text>
              <TouchableOpacity
                style={styles.searchBox}
                onPress={() => openLocationModal('province')}
              >
                <Text style={styles.selectText}>
                  {selectedLocation.province?.name || 'Chọn Tỉnh/Thành'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: '90%' }}>
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.pick_location)}
              </Text>
              <TouchableOpacity
                style={styles.searchBox}
                onPress={() => openLocationModal('district')}
              >
                <Text style={styles.selectText}>
                  {selectedLocation.district?.name || 'Chọn Quận/Huyện'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: '90%' }}>
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.pick_location)}
              </Text>
              <TouchableOpacity
                style={styles.searchBox}
                onPress={() => openLocationModal('commune')}
              >
                <Text style={styles.selectText}>
                  {selectedLocation.commune?.name || 'Chọn Xã/Bản'}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.find_street)}
              </Text>
              <View
                style={[
                  styles.searchBox,
                  { paddingVertical: 0, paddingHorizontal: 0 },
                ]}
              >
                <TextInput
                  style={styles.searchInput}
                  value={selectedLocation.street}
                  onChangeText={text =>
                    setSelectedLocation(prev => ({ ...prev, street: text }))
                  }
                  placeholder="Nhập tên đường"
                />
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <AppButton
              customStyle={[{ width: '40%' }]}
              title={t(text.cancel)}
              onPress={onClose}
            />
            <AppButton
              customStyle={[{ width: '40%' }]}
              title={t(text.accept)}
              onPress={handleSubmit}
            />
          </View>

          <PropertyLocationModal
            visible={locationModalVisible}
            onClose={() => setLocationModalVisible(false)}
            onSelect={handleLocationSelect}
            field={locationModalField}
            selected={selectedLocation}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SearchLocationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    maxHeight: '80%',
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: Spacing.medium,
  },
  header: {
    paddingHorizontal: Spacing.medium,
    justifyContent: 'space-between',
  },
  headerItem: {
    marginBottom: Spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    width: '90%',
    paddingHorizontal: Spacing.medium,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.small,
    paddingHorizontal: Spacing.medium,
  },
  selectBox: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginBottom: Spacing.medium,
  },
  selectText: {
    color: Colors.black,
  },
  closeButton: {
    marginRight: Spacing.medium,
  },
  clearIcon: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: Colors.Gray,
    width: 40,
    height: 40,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Colors.black,
  },
  body: {
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: '100%',
    borderRadius: 30,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.medium,
    backgroundColor: Colors.white,
    borderColor: Colors.Gray,
    borderWidth: 1,
  },
});
