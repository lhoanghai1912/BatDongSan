import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native';
import AppStyles from '../../../components/AppStyle';
import { ICONS, text } from '../../../utils/constants';
import NavBar from '../../../components/Navbar';
import { Spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';
import { Colors } from '../../../utils/color';
import { useTranslation } from 'react-i18next';
import PropertyDetailsView from '../../../components/PropertyFeature';
import { Screen_Name } from '../../../navigation/ScreenName';
import { navigate } from '../../../navigation/RootNavigator';

const { width } = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}
const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { post } = route.params; // mảng các URL ảnh
  console.log('route', route);
  console.log('data', post);

  console.log(
    'imagessssssssssssssssssssssssssssssssssssssss',
    post.images.map(item => item.imageUrl),
  );

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
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <NavBar
            onPress={() => navigation.goBack()}
            icon1={ICONS.share}
            onRightPress1={() => navigate(Screen_Name.Home_Screen)}
            icon2={ICONS.heart}
            onRightPress2={() => navigate(Screen_Name.Heart_Screen)}
          />
          <FlatList
            data={post.images.map(item => item.imageUrl)}
            keyExtractor={item => item.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <>
                <View style={{ flex: 1, height: 300 }}>
                  <Image
                    source={{ uri: `${text.url}${item}` }}
                    style={[styles.image, { flex: 1 }]}
                  />
                </View>
              </>
            )}
          />
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
          <View
            style={{
              paddingHorizontal: Spacing.medium,
              flexDirection: 'row',
              marginBottom: Spacing.medium,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
                {`${post.bedrooms === 0 ? '' : `${post.bedrooms} phòng ngủ`} `}
              </Text>
              <Image
                source={ICONS.bed}
                style={[
                  styles.icon,
                  { display: post.bedrooms === 0 ? 'none' : 'flex' },
                ]}
              />
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
                {`${
                  post.bathrooms === 0 ? '' : `${post.bathrooms} phòng tắm`
                } `}
              </Text>
              <Image
                source={ICONS.bath}
                style={[
                  styles.icon,
                  { display: post.bedrooms === 0 ? 'none' : 'flex' },
                ]}
              />
            </View>
          </View>
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
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
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
