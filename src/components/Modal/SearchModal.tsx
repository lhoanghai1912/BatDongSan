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
import { ICONS } from '../../utils/constants';
import AppButton from '../AppButton';
import AppStyles from '../AppStyle';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSearch: (value: 'forSale' | 'forRent') => void;
}

const SearchModal: React.FC<Props> = ({ visible, onClose, onSearch }) => {
  const [selected, setSelected] = useState<'forSale' | 'forRent'>('forSale');

  const handleSubmit = () => {
    onSearch(selected);
    onClose();
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
                    Mua
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
                    Thuê
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.icon}></View>
            </View>
            <View style={[styles.headerItem, { alignSelf: 'center' }]}>
              <Text style={[AppStyles.label]}>{`Tìm BĐS ở ...`}</Text>
            </View>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={{ color: Colors.darkGray }}>
              Nội dung tuỳ chọn ở đây
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <AppButton title="Tìm kiếm" onPress={handleSubmit} />
          </View>
        </View>
      </View>
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
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 0.5,
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
    flex: 2,

    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  footer: {
    flex: 0.2,

    paddingBottom: Spacing.medium,
  },
});
