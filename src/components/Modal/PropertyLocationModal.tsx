// PropertyLocationModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AppInput from '../AppInput';
import { Colors } from '../../utils/color';
import { Spacing } from '../../utils/spacing';
import { text } from '../../utils/constants';
import AppButton from '../AppButton';
import { useTranslation } from 'react-i18next';
import { Fonts } from '../../utils/fontSize';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: any) => void;
  field: 'province' | 'district' | 'ward' | null;
  selected: {
    province: any;
    district: any;
    ward: any;
  };
}

const PropertyLocationModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  field,
  selected,
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (!visible || !field) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let url = 'https://bds.foxai.com.vn:8441/api/Area/search-smart?lang=en';

        if (field === 'district') {
          if (!selected.province?.id) {
            setOptions([]);
            setLoading(false);
            return;
          }
          url = `https://bds.foxai.com.vn:8441/api/Area/search-smart?id=${selected.province.id}&lang=en`;
        } else if (field === 'ward') {
          if (!selected.district?.id) {
            setOptions([]);
            setLoading(false);
            return;
          }
          url = `https://bds.foxai.com.vn:8441/api/Area/search-smart?id=${selected.district.id}&lang=en`;
        }

        const res = await fetch(url);
        const data = await res.json();
        console.log('data', data);

        if (Array.isArray(data)) {
          setOptions(data);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setSearchText('');
    setSelectedItem(null);
  }, [field, visible, selected]);

  const filteredOptions = options.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const getTitle = () => {
    switch (field) {
      case 'province':
        return 'Chọn Tỉnh/Thành';
      case 'district':
        return selected.province
          ? 'Chọn Quận/Huyện'
          : 'Vui lòng chọn Tỉnh/Thành trước';
      case 'ward':
        return selected.district
          ? 'Chọn Xã/Bản'
          : 'Vui lòng chọn Quận/Huyện trước';
      default:
        return '';
    }
  };

  const handleAccept = () => {
    if (selectedItem) {
      onSelect(selectedItem);
    } else if (filteredOptions.length === 0 && searchText.trim() !== '') {
      onSelect({ id: null, name: searchText.trim() });
    } else if (field === 'ward' && options.length === 0) {
      onSelect({ id: null, name: '' });
    } else {
      onSelect(null);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{getTitle()}</Text>

          {filteredOptions.length === 0 ? (
            <></>
          ) : (
            <AppInput
              placeholder="Tìm kiếm theo tên"
              value={searchText}
              onChangeText={setSearchText}
              style={{ marginBottom: Spacing.small }}
            />
          )}

          {loading ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={{ marginVertical: Spacing.medium }}
            />
          ) : filteredOptions.length > 0 ? (
            <ScrollView>
              {filteredOptions.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemButton,
                    selectedItem?.id === item.id && {
                      backgroundColor: Colors.blue,
                    },
                  ]}
                  onPress={() => setSelectedItem(item)}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>
              {field === 'district'
                ? 'Không tìm thấy huyện phù hợp'
                : 'Không tìm thấy bản phù hợp'}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: Spacing.medium,
            }}
          >
            <AppButton
              customStyle={[{ width: '45%' }]}
              onPress={onClose}
              title={t(text.cancel)}
            />
            <AppButton
              customStyle={[{ width: '45%' }]}
              onPress={handleAccept}
              title={t(text.accept)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PropertyLocationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.medium,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.small,
    color: Colors.black,
  },
  itemButton: {
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingHorizontal: Spacing.medium,
    borderRadius: 20,
  },
  itemText: {
    fontSize: 16,
    color: Colors.black,
  },
  closeButton: {
    marginTop: Spacing.medium,
    alignSelf: 'center',
  },
  closeText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    marginTop: Spacing.medium,
    color: Colors.black,
    textAlign: 'center',
    fontSize: Fonts.normal,
  },
});
