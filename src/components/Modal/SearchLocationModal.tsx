import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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

type FieldType = 'province' | 'district' | 'ward';

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
    ward: any;
  }>({ province: null, district: null, ward: null });

  const handleSubmit = () => {
    onSearch(selectedLocation);
    console.log(selectedLocation);

    onClose();
    setSelectedLocation({ province: null, district: null, ward: null });
  };

  const openLocationModal = (field: FieldType) => {
    if (field === 'district' && !selectedLocation.province) {
      alert('Vui lòng chọn Tỉnh/Thành trước');
      return;
    }
    if (field === 'ward' && !selectedLocation.district) {
      alert('Vui lòng chọn Quận/Huyện trước');
      return;
    }
    setLocationModalField(field);
    setLocationModalVisible(true);
  };

  const handleLocationSelect = (location: any) => {
    if (locationModalField === 'province') {
      setSelectedLocation({ province: location, district: null, ward: null });
    } else if (locationModalField === 'district') {
      setSelectedLocation(prev => ({
        ...prev,
        district: location,
        ward: null,
      }));
    } else if (locationModalField === 'ward') {
      setSelectedLocation(prev => ({ ...prev, ward: location }));
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
                    ward: null,
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
            <Text style={AppStyles.label}>{t(text.pick_location)}</Text>

            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => openLocationModal('province')}
            >
              <Text style={styles.selectText}>
                {selectedLocation.province?.name || 'Chọn Tỉnh/Thành'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => openLocationModal('district')}
            >
              <Text style={styles.selectText}>
                {selectedLocation.district?.name || 'Chọn Quận/Huyện'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => openLocationModal('ward')}
            >
              <Text style={styles.selectText}>
                {selectedLocation.ward?.name || 'Chọn Xã/Bản'}
              </Text>
            </TouchableOpacity>
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
    width: '100%',
    paddingHorizontal: Spacing.medium,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.small,
    paddingHorizontal: Spacing.medium,
  },
  selectBox: {
    width: '90%',
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginTop: Spacing.medium,
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
});
