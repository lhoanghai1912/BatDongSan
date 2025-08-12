import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Linking,
} from 'react-native';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import { Spacing } from '../../utils/spacing';
import AppStyles from '../../components/AppStyle';
import { Colors } from '../../utils/color';
import { Fonts } from '../../utils/fontSize';
import {
  formatAddress,
  ICONS,
  IMAGES,
  link,
  message,
  text,
} from '../../utils/constants';
import AppButton from '../../components/AppButton';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { checkLike, likePost, unlikePost } from '../../service';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { likePost } from '../../service/likeService';

type ImageCardProps = {
  post: any;
  onReload?: () => void; // 🔹 Optional
};
const ImageCard: React.FC<ImageCardProps> = ({ post, onReload }) => {
  const { t } = useTranslation();
  const images = post.images?.map(img => img).slice(0, 4) || [];
  const imageslink = post.images?.map(img => img.imageUrl).slice(0, 4) || [];

  const { userData: reduxUserData, token: reduxToken } = useSelector(
    (state: any) => state.user,
  );

  const [userData, setUserData] = useState(reduxUserData || null);
  const [token, setToken] = useState(reduxToken || '');
  const [liked, setLiked] = useState<boolean>(post?.isLiked);
  const updated =
    moment(post.createdAt).format('DD/MM/YYYY') ===
    moment().format('DD/MM/YYYY')
      ? t(text.today)
      : moment(post.createdAt).format('DD/MM/YYYY');

  const fetchUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUserData(JSON.parse(storedUser));
      } else {
        setToken(reduxToken);
        setUserData(reduxUserData);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    // Only run once on mount
  }, []);
  if (imageslink.length === 0) return null;
  const formatPriceToTy = (price: number): string => {
    if (!price || isNaN(price)) return t(text.deal);

    if (price >= 1_000_000_000) {
      const billion = price / 1_000_000_000;
      return billion % 1 === 0
        ? `${billion.toFixed(0)} ${t(text.bilion)}` // Hiển thị số nguyên nếu chia hết
        : `${billion.toFixed(2)} ${t(text.bilion)}`; // Hiển thị 2 chữ số thập phân nếu không chia hết
    }

    if (price >= 1_000_000) {
      const million = price / 1_000_000;
      return million % 1 === 0
        ? `${million.toFixed(0)} ${t(text.milion)}`
        : `${million.toFixed(2)} ${t(text.milion)}`;
    }

    if (price >= 1_000) {
      const thousand = price / 1_000;
      return thousand % 1 === 0
        ? `${thousand.toFixed(0)} ${t(text.thousand)}`
        : `${thousand.toFixed(2)} ${t(text.thousand)}`;
    }
    if (price === 0) {
      return `${t(text.deal)}`;
    }
    return `${price.toFixed(0)} `; // Trả về giá trị nếu không thuộc các loại trên
  };
  const handleLike = React.useCallback(async () => {
    if (token) {
      try {
        if (liked === false) {
          await likePost(post.id, true);
          setLiked(true);
        } else if (liked === true) {
          await likePost(post.id, false);
          setLiked(false);
        }
        if (onReload) {
          onReload();
        }
      } catch (error) {
        console.error('Lỗi like/unlike:', error);
      }
    } else {
      Toast.show({
        type: `error`,
        text1: `${t(message.text1Error)}`,
        text2: `${t(message.requestLogin)}`,
        visibilityTime: 1500,
      });
    }
  }, [token, liked, post.id, t, message, onReload]);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigate(Screen_Name.Detail_Screen, { post })}
    >
      <View style={{ marginBottom: Spacing.medium }}>
        {images.length === 1 && imageslink[0] ? (
          <Image
            source={{ uri: `${link.url}${imageslink[0]}` }}
            style={styles.fullImage}
          />
        ) : (
          images.length > 1 && (
            <>
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: `${link.url}${imageslink[0]}` }}
                  style={[
                    styles.topImage,
                    { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                  ]}
                />
              </View>

              <View style={styles.bottomRow}>
                {images.slice(1).map((img, idx) => {
                  // Kiểm tra ảnh trước khi hiển thị
                  if (!img.imageUrl) return null;

                  return (
                    <View
                      key={img.displayOrder}
                      style={[styles.imageWrap, { flex: 1 }]}
                    >
                      <Image
                        source={{ uri: `${link.url}${img.imageUrl}` }}
                        style={[
                          styles.bottomImage,
                          {
                            borderBottomLeftRadius: idx === 0 ? 20 : 0,
                            borderBottomRightRadius:
                              idx === images.length - 2 ? 20 : 0,
                          },
                        ]}
                      />
                    </View>
                  );
                })}
                {post.images.length > 1 && (
                  <View style={styles.imageCountBadge}>
                    <Image
                      source={ICONS.image}
                      style={{ width: 20, height: 20, tintColor: Colors.white }}
                    />
                    <Text style={styles.imageCountText}>
                      {post.images.length}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )
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
          {post.unit === 3 ? (
            <Text style={[AppStyles.text, { color: Colors.red }]}>{` ${t(
              text.deal,
            )}`}</Text>
          ) : (
            <>
              <Text style={[AppStyles.text, { color: Colors.red }]}>
                {formatPriceToTy(post.price)}
              </Text>
              <Text
                style={{
                  marginHorizontal: Spacing.small,
                  fontSize: Fonts.normal,
                }}
              >
                •
              </Text>
              <Text
                style={[AppStyles.text, { color: Colors.red }]}
              >{`${post.area} m²`}</Text>
              <Text
                style={{
                  marginHorizontal: Spacing.small,
                  fontSize: Fonts.normal,
                }}
              >
                •
              </Text>
              <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
                {`${formatPriceToTy(post.price / post.area)}/m²`}
              </Text>
            </>
          )}
          {post.bathrooms === 0 || post.bathrooms === null ? (
            <></>
          ) : (
            <>
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
                  {`${post.bedrooms === 0 ? '' : post.bedrooms} `}
                </Text>
                <Image
                  source={ICONS.bed}
                  style={[
                    styles.icon,
                    { display: post.bedrooms === 0 ? 'none' : 'flex' },
                  ]}
                />
              </View>
            </>
          )}
          {post.bedrooms === 0 || post.bedrooms === null ? (
            <></>
          ) : (
            <>
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
                  {`${post.bathrooms === 0 ? '' : post.bathrooms} `}
                </Text>
                <Image
                  source={ICONS.bath}
                  style={[
                    styles.icon,
                    { display: post.bedrooms === 0 ? 'none' : 'flex' },
                  ]}
                />
              </View>
            </>
          )}
        </View>
        <View style={[styles.descriptionItem, {}]}>
          <Image source={ICONS.location} style={styles.icon} />
          <Text
            numberOfLines={1}
            style={[AppStyles.text, { color: Colors.darkGray }]}
          >
            {formatAddress(post)}
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
          <Image
            source={
              post?.avatarUrl
                ? { uri: `${link.url}${post.avatarUrl}` }
                : IMAGES.avartar
            }
            style={AppStyles.avartar_item}
          />
          <View style={{ marginLeft: Spacing.small }}>
            <Text style={[AppStyles.text, { color: Colors.black }]}>
              {post.contactName}
            </Text>
            <Text
              style={[
                AppStyles.text,
                { fontSize: Fonts.small, color: Colors.darkGray },
              ]}
            >
              {`${t(text.created)}: ${updated}`}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.descriptionItem,
            {
              justifyContent: 'space-evenly',
              flex: 1.2,
            },
          ]}
        >
          <AppButton
            leftIcon={ICONS.phone}
            title={post.contactPhone}
            onPress={() => {
              Linking.openURL(`tel:${post.contactPhone}`).catch(err =>
                console.error(
                  'An error occurred while attempting to make a call',
                  err,
                ),
              );
            }}
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
            onPress={() => handleLike()}
          >
            <Image
              source={liked ? ICONS.heart_like : ICONS.heart}
              style={AppStyles.icon}
            />
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
    borderRadius: 20,
  },
  topImage: {
    // width: '100%',
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
  imageCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: Spacing.small,
    right: Spacing.small,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 20,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.small,
  },
  imageCountText: {
    color: '#fff',
    paddingLeft: Spacing.small,
    fontSize: Fonts.normal,
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
