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
import SearchLocationModal from './SearchLocationModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSearch: (value: number, location: any) => void;
}

const SearchModal: React.FC<Props> = ({ visible, onClose, onSearch }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<'forSale' | 'forRent'>('forSale');
  const [modalLocationSearchVisible, setModalLocationSearchVisible] =
    useState(false);
  const [locationText, setLocationText] = useState('');
  const [location, setLocation] = useState<any>(null);
  const handleReset = () => {
    setLocationText('');
    setLocation([]);
  };

  const handleSubmit = () => {
    const result = selected === 'forSale' ? 1 : 2;
    onSearch(result, location || {}); // Truyền về 1 hoặc 2 và location
    onClose();
  };

  const handleSearchLocation = (location: any) => {
    setLocation(location);
    console.log('location: ', location);
    console.log(
      'province: ',
      location?.province?.id,
      'distric: ',
      location?.district?.id,
      'commnue: ',
      location?.commnue?.id,
    );

    setLocationText(location);
    const parts = [
      location?.street,
      location?.commune?.name || '',
      location?.district?.name,
      location?.province?.name,
    ].filter(Boolean); // lọc null/undefined
    setLocationText(parts.join(', ')); // Ví dụ: "Phường Bến Nghé, Quận 1, TP.HCM"
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerItem}>
              <TouchableOpacity onPress={onClose}>
                <Image
                  source={ICONS.clear}
                  style={[
                    {
                      backgroundColor: Colors.white,
                      borderRadius: 50,
                      borderWidth: 0.5,
                      borderColor: Colors.Gray,
                      width: 30,
                      height: 30,
                    },
                  ]}
                />
              </TouchableOpacity>

              <View style={styles.tabWrap}>
                <TouchableOpacity
                  onPress={() => setSelected('forSale')}
                  style={[
                    styles.tab,
                    selected === 'forSale' && styles.tabActive,
                  ]}
                >
                  <Text
                    style={
                      selected === 'forSale'
                        ? styles.tabTextActive
                        : styles.tabText
                    }
                  >
                    {t(text.sale)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelected('forRent')}
                  style={[
                    styles.tab,
                    selected === 'forRent' && styles.tabActive,
                  ]}
                >
                  <Text
                    style={
                      selected === 'forRent'
                        ? styles.tabTextActive
                        : styles.tabText
                    }
                  >
                    {t(text.rent)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.icon}></View>
            </View>
            <View style={[styles.body]}>
              <TouchableOpacity
                onPress={() => {
                  setModalLocationSearchVisible(true);
                }}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: Spacing.small,
                  justifyContent: 'space-between',
                }}
              >
                <Image style={AppStyles.icon} />
                <Text
                  style={[
                    AppStyles.text,
                    {
                      textAlign: 'center',
                      color: Colors.black,
                    },
                  ]}
                >
                  {`${t(text.find_location)}:\n ${locationText || '...'} `}
                </Text>
                <Image source={ICONS.edit} style={AppStyles.icon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Body */}
          {/* <View style={styles.body}></View> */}

          {/* Footer */}
          <View style={styles.footer}>
            <AppButton
              customStyle={[{ width: '45%' }]}
              title={t(text.reset)}
              onPress={() => handleReset()}
            />
            <AppButton
              customStyle={[{ width: '45%' }]}
              title={t(text.find)}
              onPress={() => handleSubmit()}
            />
          </View>
        </View>
      </View>
      <SearchLocationModal
        visible={modalLocationSearchVisible}
        onClose={() => setModalLocationSearchVisible(false)}
        onSearch={handleSearchLocation}
      />
    </Modal>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000088',
  },
  modal: {
    maxHeight: '80%',
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.lightGray,
    justifyContent: 'space-between',
    marginBottom: Spacing.medium,
  },
  headerItem: {
    flexDirection: 'row',
    marginVertical: Spacing.medium,
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Colors.black,
  },
  tabWrap: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    paddingVertical: Spacing.small,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: Colors.black,
  },
  tabText: {
    color: Colors.Gray,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  footer: {
    paddingBottom: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
