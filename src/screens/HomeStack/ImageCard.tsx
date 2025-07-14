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
import { Fonts } from '../../utils/fontSize';
import { ICONS, IMAGES } from '../../utils/constants';
import moment from 'moment';
import AppButton from '../../components/AppButton';

const screenWidth = Dimensions.get('window').width;
const ImageCard = ({ post }) => {
  const images = post.images?.map(img => img.link).slice(0, 4) || [];

  if (images.length === 0) return null;
  const formatPriceToTy = (price: number): string => {
    if (!price || isNaN(price)) return '0 đồng';

    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(2)} tỷ`;
    }

    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(0)} triệu`;
    }

    if (price >= 1_000) {
      return `${(price / 1_000).toFixed(0)} nghìn`;
    }

    return `${price.toFixed(0)} đồng`;
  };
  const updated =
    moment(post.updatedAt).format('DD/MM/YYYY') ===
    moment().format('DD/MM/YYYY')
      ? 'Hôm nay'
      : moment(post.updatedAt).format('DD/MM/YYYY');

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

                return (
                  <View
                    key={`img_${idx}`}
                    style={[styles.imageWrap, { flex: 1 }]}
                  >
                    <Image
                      source={{ uri: img }}
                      style={[
                        styles.bottomImage,
                        {
                          borderBottomLeftRadius: idx === 0 ? 20 : 0,
                          borderBottomRightRadius:
                            idx === imageCount - 1 ? 20 : 0,
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
      <View style={{ marginBottom: Spacing.medium }}>
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
        <View style={styles.descriptionRow}>
          <Text style={[AppStyles.text, { color: Colors.red }]}>
            {formatPriceToTy(post.info_main.price)}
          </Text>
          <Text
            style={{
              marginHorizontal: Spacing.small,
              fontSize: Fonts.normal,
            }}
          >
            •
          </Text>
          <Text style={[AppStyles.text, { color: Colors.red }]}>
            {`${post.info_main.acreage} m²`}
          </Text>
          <Text
            style={{
              marginHorizontal: Spacing.small,
              fontSize: Fonts.normal,
            }}
          >
            •
          </Text>
          <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
            {`${formatPriceToTy(
              post.info_main.price / post.info_main.acreage,
            )}/m²`}
          </Text>
          <Text
            style={{
              marginHorizontal: Spacing.small,
              fontSize: Fonts.normal,
            }}
          >
            •
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
              {`${post.info_other.bedrooms} `}
            </Text>
            <Image source={ICONS.bed} style={styles.icon} />
          </View>
          <Text
            style={{
              marginHorizontal: Spacing.small,
              fontSize: Fonts.normal,
            }}
          >
            •
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
              {`${post.info_other.bathrooms} `}
            </Text>
            <Image source={ICONS.bath} style={styles.icon} />
          </View>
        </View>
        <View style={[styles.descriptionItem]}>
          <Image source={ICONS.location} style={styles.icon} />
          <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
            {`${post.address.district}, ${[post.address.province]}`}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.descriptionRow,
          {
            marginBottom: 0,
            justifyContent: 'space-between',
            height: 50,
          },
        ]}
      >
        <View
          style={[
            styles.descriptionItem,
            {
              flex: 1,
            },
          ]}
        >
          <Image source={IMAGES.avartar} style={AppStyles.avartar_item} />
          <View style={{ marginLeft: Spacing.small }}>
            <Text style={[AppStyles.text, { color: Colors.black }]}>
              {post.contact.name}
            </Text>
            <Text
              style={[
                AppStyles.text,
                { fontSize: Fonts.small, color: Colors.darkGray },
              ]}
            >
              {`Đăng : ${updated}`}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.descriptionItem,
            {
              justifyContent: 'space-between',
              flex: 1.2,
            },
          ]}
        >
          <AppButton
            leftIcon={ICONS.phone}
            title={post.contact.phone}
            onPress={() => console.log('phone pressed')}
            customStyle={[{ height: 50 }]}
          />
          <TouchableOpacity
            style={{
              borderRadius: 50,
              borderWidth: 1,
              borderColor: Colors.Gray,
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => console.log('heart pressed')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image source={ICONS.heart} style={AppStyles.icon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  container: {
    padding: 1,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: Spacing.medium,
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
  },
  bottomRow: {
    flexDirection: 'row',
  },
  bottomImage: {
    height: 100,
    resizeMode: 'cover',
  },
  descriptionRow: {
    marginBottom: Spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
});
