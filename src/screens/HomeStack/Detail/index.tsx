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
} from 'react-native';
import AppStyles from '../../../components/AppStyle';
import { ICONS, link, text } from '../../../utils/constants';
import NavBar from '../../../components/Navbar';
import { Spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';
import { Colors } from '../../../utils/color';
import { useTranslation } from 'react-i18next';
import PropertyDetailsView from '../../../components/PropertyFeature';
import { Screen_Name } from '../../../navigation/ScreenName';
import { navigate } from '../../../navigation/RootNavigator';
import apiClient from '../../../service/apiClient';
import { checkLike, likePost, unlikePost } from '../../../service';

const { width } = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}

const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const { post } = route.params; // mảng các URL ảnh
  const [liked, setLiked] = useState(false);
  console.log('route', route);
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
  console.log(post.id);
  const handleCheckLike = async () => {
    const res = await checkLike(post.id);
    setLiked(res.liked);
  };
  useEffect(() => {
    handleCheckLike();
  }, []);
  console.log('liked', liked);

  const handleLike = async () => {
    try {
      if (liked === false) {
        const res = await likePost(post.id);
        console.log('liked', res);
        setLiked(true); // cập nhật lại state nếu cần
      } else {
        const res = await unlikePost(post.id);
        console.log('unliked', res);
        setLiked(false); // cập nhật lại state nếu cần
      }
    } catch (error) {
      console.error('Lỗi like/unlike:', error);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar
        onPress={() => navigation.goBack()}
        icon1={ICONS.share}
        onRightPress1={() => navigate(Screen_Name.Home_Screen)}
        icon2={liked ? ICONS.heart_focus : ICONS.heart}
        onRightPress2={() => handleLike()}
      />
      <ScrollView>
        <View style={styles.header}>
          <FlatList
            data={post.images.map(item => item.imageUrl)}
            keyExtractor={item => item.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ flex: 1, height: 300 }}>
                <Image
                  source={{ uri: `${link.url}${item}` }}
                  style={[styles.image, { flex: 1 }]}
                />
              </View>
            )}
          />
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
                    {`${post.bedrooms} phòng ngủ `}
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
                    {`${post.bathrooms} phòng tắm `}
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
          <Text
            style={[AppStyles.text, { marginBottom: Spacing.medium }]}
          >{`${post.street}, ${post.communeName}, ${post.districtName}`}</Text>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
});
