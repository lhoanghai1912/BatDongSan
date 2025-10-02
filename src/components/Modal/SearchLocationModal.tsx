import React, { useState, useEffect } from 'react';
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
import { ICONS, message, text } from '../../utils/constants';
import AppButton from '../AppButton';
import AppStyles from '../AppStyle';
import { useTranslation } from 'react-i18next';
import PropertyLocationModal from './PropertyLocationModal';
import MapView, { Marker } from 'react-native-maps';
import MapModal from './MapModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSearch: (location: any) => void;
  post?: any;
}

type FieldType = 'province' | 'district' | 'commune';

const SearchLocationModal: React.FC<Props> = ({
  visible,
  onClose,
  onSearch,
  post,
}) => {
  const { t } = useTranslation();

  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationModalField, setLocationModalField] =
    useState<FieldType | null>(null);
  const [showMap, setShowMap] = useState(false);

  // ✅ Khởi tạo selectedLocation từ post (nếu có)
  const [selectedLocation, setSelectedLocation] = useState<{
    province: any;
    district: any;
    commune: any;
    street: string;
  }>({
    province: post?.provinceId
      ? {
          type: 'Province',
          name: post.provinceName,
          id: post.provinceId,
        }
      : null,
    district: post?.districtId
      ? {
          type: 'District',
          name: post.districtName,
          id: post.districtId,
          parentId: post.provinceId,
        }
      : null,
    commune: post?.communeId
      ? {
          type: 'Commune', // ✅ Chú ý: API trả về 'Ward' chứ không phải 'Commune'
          name: post.communeName,
          id: post.communeId,
          parentId: post.districtId,
        }
      : null,
    street: post?.street || '',
  });

  // ✅ Sync selectedLocation khi post thay đổi
  useEffect(() => {
    if (post) {
      console.log('🔄 Syncing location from post:', post);
      setSelectedLocation({
        province: post.provinceId
          ? {
              type: 'Province',
              name: post.provinceName,
              id: post.provinceId,
            }
          : null,
        district: post.districtId
          ? {
              type: 'District',
              name: post.districtName,
              id: post.districtId,
              parentId: post.provinceId,
            }
          : null,
        commune: post.communeId
          ? {
              type: 'Commune',
              name: post.communeName,
              id: post.communeId,
              parentId: post.districtId,
            }
          : null,
        street: post.street || '',
      });
    }
  }, [post?.id]); // ✅ Depend on post.id để detect thay đổi

  const handleSubmit = () => {
    console.log('📤 Submitting location:', selectedLocation);
    onSearch(selectedLocation);
    onClose();
    // ❌ KHÔNG reset selectedLocation ở đây nữa!
    // setSelectedLocation({ province: null, district: null, commune: '', street: '' });
  };

  const openLocationModal = (field: FieldType) => {
    if (field === 'district' && !selectedLocation.province) {
      alert(t(message.province_first));
      return;
    }
    if (field === 'commune' && !selectedLocation.district) {
      alert(t(message.district_first));
      return;
    }
    setLocationModalField(field);
    setLocationModalVisible(true);
  };

  console.log('📍 Current selectedLocation:', selectedLocation);

  const handleLocationSelect = (location: any) => {
    console.log('✅ Location selected:', location);

    if (locationModalField === 'province') {
      // ✅ Chỉ reset district/commune nếu province thay đổi
      const isProvinceChanged = selectedLocation.province?.id !== location.id;

      setSelectedLocation({
        province: location,
        district: isProvinceChanged ? null : selectedLocation.district, // ✅ Giữ district nếu province không đổi
        commune: isProvinceChanged ? null : selectedLocation.commune, // ✅ Giữ commune nếu province không đổi
        street: selectedLocation.street,
      });
    } else if (locationModalField === 'district') {
      // ✅ Chỉ reset commune nếu district thay đổi
      const isDistrictChanged = selectedLocation.district?.id !== location.id;

      setSelectedLocation(prev => ({
        ...prev,
        district: location,
        commune: isDistrictChanged ? null : prev.commune, // ✅ Giữ commune nếu district không đổi
      }));
    } else if (locationModalField === 'commune') {
      setSelectedLocation(prev => ({
        ...prev,
        commune: location,
      }));
    }

    setLocationModalVisible(false);
  };

  const handleClose = () => {
    // ✅ Khi đóng modal, reset về giá trị ban đầu từ post
    if (post) {
      setSelectedLocation({
        province: post.provinceId
          ? {
              type: 'Province',
              name: post.provinceName,
              id: post.provinceId,
            }
          : null,
        district: post.districtId
          ? {
              type: 'District',
              name: post.districtName,
              id: post.districtId,
              parentId: post.provinceId,
            }
          : null,
        commune: post.communeId
          ? {
              type: 'Ward',
              name: post.communeName,
              id: post.communeId,
              parentId: post.districtId,
            }
          : null,
        street: post.street || '',
      });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerItem}>
              <TouchableOpacity onPress={handleClose}>
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

            {/* Province */}
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
                  {selectedLocation.province?.name ||
                    t(message.select_province)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* District */}
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
                  {selectedLocation.district?.name ||
                    t(message.select_district)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Commune */}
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
                  {selectedLocation.commune?.name || t(message.select_commune)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Street */}
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
                  editable={
                    !!selectedLocation.province?.name &&
                    !!selectedLocation.district?.name
                  }
                  onChangeText={text =>
                    setSelectedLocation(prev => ({ ...prev, street: text }))
                  }
                  placeholder={t(message.enter_street)}
                />
              </View>
              <AppButton title="Map" onPress={() => setShowMap(true)} />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <AppButton
              customStyle={[{ width: '40%' }]}
              title={t(text.cancel)}
              onPress={handleClose}
            />
            <AppButton
              customStyle={[{ width: '40%' }]}
              title={t(text.submit)}
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
          <MapModal
            visible={showMap}
            onClose={() => setShowMap(false)}
            latitude={post?.latitude || 21.0278}
            longitude={post?.longitude || 105.8342}
            title="Hà Nội"
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
    maxHeight: '85%',
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
