import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import AppStyles from '../../../components/AppStyle';
import { formatAddress, ICONS, link, text } from '../../../utils/constants';
import NavBar from '../../../components/Navbar';
import { Spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';
import { Colors } from '../../../utils/color';
import { useTranslation } from 'react-i18next';
import PropertyDetailsView from '../../../components/PropertyFeature';
import { Screen_Name } from '../../../navigation/ScreenName';
import { navigate } from '../../../navigation/RootNavigator';
import apiClient from '../../../service/apiClient';
import { useSelector } from 'react-redux';
import AppButton from '../../../components/AppButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImagePreviewModal from '../../../components/Modal/ImagePreviewModal';
import { likePost } from '../../../service/likeService';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { deletePost } from '../../../service';
import { setLoading } from '../../../store/reducers/loadingSlice';

const { width } = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}

const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { userData } = useSelector((state: any) => state.user);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const { post } = route.params; // mảng các URL ảnh
  const [liked, setLiked] = useState<boolean>(post?.isLiked);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const { userData: reduxUserData, token: reduxToken } = useSelector(
    (state: any) => state.user,
  );

  const [token, setToken] = useState(reduxToken || '');
  const [owner] = useState(userData?.email === post.creatorName);
  console.log('route1112341234242134', route?.params);
  console.log('data', post);
  const IMAGE_HEIGHT = 300; // chiều cao ảnh
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT / 2, IMAGE_HEIGHT],
    outputRange: [
      'rgba(255,255,255,0)',
      'rgba(255,255,255,0.7)',
      'rgba(255,255,255,1)',
    ],
    extrapolate: 'clamp',
  });

  const formatPriceToTy = (price: number): string => {
    if (!price || isNaN(price)) return t(text.deal);

    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(2)} ${t(text.bilion)}`;
    }

    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(2)} ${t(text.milion)}`;
    }

    if (price >= 1_000) {
      return `${(price / 1_000).toFixed(2)} ${t(text.thousand)}`;
    }

    return `${price.toFixed(0)} `;
  };
  console.log(post.id);

  const handleLike = async () => {
    console.log('liked', liked);
    console.log('post', post);

    try {
      if (liked === false) {
        const res = await likePost(post.id, true);
        setLiked(true); // cập nhật lại state nếu cần
        console.log('databack: ', res);
      } else if (liked === true) {
        const res = await likePost(post.id, false);
        setLiked(false); // cập nhật lại state nếu cần
        console.log('databack: ', res);
      }
    } catch (error) {}
  };

  const handleDeletePost = async (postId: any) => {
    try {
      setLoading(true);
      console.log('start delete');
      console.log('postId', postId);

      const response = await deletePost(postId);
      console.log('response', response);
    } catch (error) {
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={item.displayOrder}
        style={{ flex: 1, height: 300 }}
        activeOpacity={0.9}
        onPress={() => {
          setPreviewIndex(index);
          setPreviewVisible(true);
        }}
      >
        <Image
          source={{ uri: `${link.url}${item}` }}
          style={[styles.image, { flex: 1 }]}
        />
        <View style={styles.imageCountBadge}>
          <Text style={styles.imageCountText}>
            {index + 1}/{post.images.length}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container]}>
      <NavBar
        onPress={() => navigation.goBack()}
        icon1={ICONS.share}
        onRightPress1={() => navigate(Screen_Name.Home_Screen)}
        icon2={liked ? ICONS.heart_like : ICONS.heart}
        onRightPress2={() => handleLike()}
      />
      <ScrollView style={{ marginVertical: Spacing.medium }}>
        <View style={styles.header}>
          {/* {post.images && ( */}
          <FlatList
            data={post.images.map(item => item.imageUrl)}
            keyExtractor={item => item.displayOrder}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />
          {/* )} */}
          {post.unit === 3 ? (
            <Text
              style={[
                AppStyles.text,
                {
                  marginTop: Spacing.medium,
                  marginBottom: Spacing.medium,
                  paddingHorizontal: Spacing.medium,
                  color: Colors.red,
                },
              ]}
            >{`${t(text.deal)}`}</Text>
          ) : (
            <View
              style={{
                paddingHorizontal: Spacing.medium,
                flexDirection: 'row',
                marginTop: Spacing.medium,
                marginBottom: Spacing.small,
              }}
            >
              <Text style={[AppStyles.text, { color: 'red' }]}>
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
              <Text style={[AppStyles.text, { color: 'red' }]}>
                {`${post.area} m²`}
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
                {`${formatPriceToTy(post.price / post.area)}/m²`}
              </Text>
            </View>
          )}
          {post.bedrooms || post.bathrooms ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.medium,
                paddingHorizontal: Spacing.medium,
              }}
            >
              {/* Phòng ngủ */}
              {post.bedrooms ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
                    {`${post.bedrooms} ${t(text.bedrooms)} `}
                  </Text>
                  <Image source={ICONS.bed} style={styles.icon} />
                </View>
              ) : null}

              {/* Dấu chấm giữa nếu có cả hai */}
              {post.bedrooms && post.bathrooms ? (
                <Text
                  style={{
                    marginHorizontal: Spacing.small,
                    fontSize: Fonts.normal,
                  }}
                >
                  •
                </Text>
              ) : null}

              {/* Phòng tắm */}
              {post.bathrooms ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
                    {`${post.bathrooms} ${t(text.bathrooms)} `}
                  </Text>
                  <Image source={ICONS.bath} style={styles.icon} />
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
        <View style={styles.body}>
          <Text
            style={[
              AppStyles.label,
              { marginBottom: Spacing.medium, fontWeight: 'bold' },
            ]}
          >
            {post.title}
          </Text>
          <Text style={[AppStyles.text, { marginBottom: Spacing.medium }]}>
            {formatAddress(post)}
          </Text>
          <View style={AppStyles.line} />
          <View style={styles.description}>
            <Text style={AppStyles.label}>{t(text.description)}</Text>
            <Text style={[AppStyles.text, { color: Colors.black }]}>
              {post.description}
            </Text>
          </View>
          <View style={AppStyles.line} />
          <View>
            <Text style={AppStyles.label}>{t(text.property_features)}</Text>
            <PropertyDetailsView data={post} />
          </View>
          <TouchableOpacity onPress={() => {}} />
        </View>
        <AppButton
          title="Delete Post"
          onPress={() => {
            handleDeletePost(post.id);
          }}
          customStyle={[
            { display: owner ? 'flex' : 'none', marginBottom: Spacing.medium },
          ]}
        />
      </ScrollView>
      <AppButton
        title={post.contactPhone}
        leftIcon={ICONS.phone}
        customStyle={[
          {
            alignItems: 'center',
            marginBottom: Spacing.medium,
            marginHorizontal: Spacing.medium,
          },
        ]}
        onPress={() => {
          Linking.openURL(`tel:${post.contactPhone}`).catch(err =>
            console.error(
              'An error occurred while attempting to make a call',
              err,
            ),
          );
        }}
      />
      {/* Modal xem ảnh toàn màn hình */}
      <ImagePreviewModal
        visible={previewVisible}
        images={post.images.map(i => `${link.url}${i.imageUrl}`)}
        initialIndex={previewIndex}
        onClose={() => setPreviewVisible(false)}
      />
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.Gray,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  body: {
    marginTop: Spacing.medium,
    paddingHorizontal: Spacing.medium,
  },
  description: { marginBottom: Spacing.medium },
  image: {
    width,
    height: 300,
    resizeMode: 'cover',
  },
  icon: {
    width: 20,
    height: 20,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: Spacing.small,
    right: Spacing.small,
    backgroundColor: 'rgba(0,0,0,0.6)',
    // backgroundColor: 'red',
    borderRadius: 20,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.small,
  },
  imageCountText: {
    color: '#fff',
    fontSize: Fonts.normal,
  },
});
