import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import { Spacing } from '../../utils/spacing';
import AppStyles from '../../components/AppStyle';
import { Colors } from '../../utils/color';

const screenWidth = Dimensions.get('window').width;

const ImageCard = ({ post }) => {
  const images = post.images?.map(img => img.link).slice(0, 4) || [];

  if (images.length === 0) return null;
  const formatPriceToTy = (price: number): string => {
    if (!price || isNaN(price)) return '0';

    const ty = price / 1_000_000_000;

    if (ty >= 1) {
      return `${ty.toFixed(1)} tỷ`;
    }

    const trieu = price / 1_000_000;
    return `${trieu.toFixed(0)} triệu`;
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigate(Screen_Name.Detail_Screen, { post })}
    >
      <View style={{ marginBottom: Spacing.medium }}>
        {images.length === 1 && (
          <Image source={{ uri: images[0] }} style={styles.fullImage} />
        )}

        {images.length > 1 && (
          <>
            {/* Ảnh đầu tiên (full width) */}
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: images[0] }}
                style={[
                  styles.topImage,
                  { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                ]}
              />
            </View>

            {/* Ảnh còn lại chia đều */}
            <View style={styles.bottomRow}>
              {images.slice(1).map((img, idx) => {
                const imageCount = images.length - 1;
                const totalPadding = (imageCount - 1) * 2; // nếu paddingHorizontal mỗi ảnh là 1
                const imageWidth = (screenWidth - totalPadding) / imageCount;

                return (
                  <View style={[styles.imageWrap, { flex: 1 }]}>
                    <Image
                      key={idx}
                      source={{ uri: img }}
                      style={[
                        styles.bottomImage,
                        {
                          width: imageWidth,
                          borderBottomLeftRadius: idx === 0 ? 20 : 0,
                          borderBottomRightRadius:
                            idx === imageCount - 1 ? 50 : 0,
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </>
        )}
      </View>
      <View>
        <View style={{ marginBottom: Spacing.small }}>
          <Text
            style={[
              AppStyles.text,
              { color: Colors.black, fontWeight: 'bold' },
            ]}
          >
            {post.title}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: Spacing.small }}>
          <Text style={[AppStyles.text, { color: Colors.red }]}>
            {formatPriceToTy(post.info_main.price)}
          </Text>
          <View
            style={{
              borderRadius: 500,
              width: 10,
              height: 10,
              borderColor: Colors.Gray,
              borderWidth: 1,
            }}
          ></View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  container: {
    padding: 1,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  imageWrap: {
    padding: 1,
  },
  fullImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  topImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  bottomRow: {
    flexDirection: 'row',
  },
  bottomImage: {
    height: 100,
    resizeMode: 'cover',
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
});
