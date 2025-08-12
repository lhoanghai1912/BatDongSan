// components/ImagePreviewModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import { ICONS } from '../../utils/constants';
import { Colors } from '../../utils/color';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  images: string[]; // mảng URL ảnh
  initialIndex?: number;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<Props> = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const renderItem = ({ item }: { item: string }) => (
    <View style={{ width, height, backgroundColor: '#000000d3' }}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Nút đóng */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image
            source={ICONS.clear}
            style={{ width: 24, height: 24, tintColor: '#fff' }}
          />
        </TouchableOpacity>

        {/* Danh sách ảnh */}
        <FlatList
          data={images}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={e => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          keyExtractor={(_, index) => `image-${index}`}
        />

        {/* Số lượng ảnh */}
        <View style={styles.counter}>
          <Text style={{ color: '#fff' }}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePreviewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  image: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  counter: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
