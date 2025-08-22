import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ICONS, text } from '../utils/constants'; // Thêm ICONS vào đúng đường dẫn
import { Fonts } from '../utils/fontSize';
import { Colors } from '../utils/color';
import { Spacing } from '../utils/spacing';
import AppStyles from './AppStyle';
import AppButton from './AppButton';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

const PropertyDetailsView = ({ data }: { data: any }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

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

  // Mảng các đặc điểm cần hiển thị
  const features = [
    {
      key: 'price',
      title: t(text.price),
      icon: ICONS.price,
      value: formatPriceToTy(data.price),
    },
    {
      id: data.id,

      key: 'area',
      title: t(text.acreage),
      icon: ICONS.expand,
      value: data.area ? `${data.area} m²` : null,
    },
    {
      key: 'houseOrientation',
      title: t(text.modal.houseDirection),
      icon: ICONS.direction,
      value:
        data.houseOrientation === 1
          ? t(text.modal.direction.east)
          : data.houseOrientation === 2
          ? t(text.modal.direction.west)
          : data.houseOrientation === 3
          ? t(text.modal.direction.south)
          : data.houseOrientation === 4
          ? t(text.modal.direction.north)
          : data.houseOrientation === 5
          ? t(text.modal.direction.northeast)
          : data.houseOrientation === 6
          ? t(text.modal.direction.southeast)
          : data.houseOrientation === 7
          ? t(text.modal.direction.northwest)
          : data.houseOrientation === 8
          ? t(text.modal.direction.southwest)
          : null,
    },
    {
      key: 'bedrooms',
      title: t(text.bedrooms),
      icon: ICONS.bed,
      value: data.bedrooms ? `${data.bedrooms}` : null,
    },
    {
      key: 'bathrooms',
      title: t(text.bathrooms),
      icon: ICONS.bath,
      value: data.bathrooms ? `${data.bathrooms}` : null,
    },
    {
      key: 'furnishing',
      title: t(text.furnishing),
      icon: ICONS.furniture,
      value:
        data.furnishing === 1
          ? t(text.nothave)
          : data.furnishing === 2
          ? t(text.have)
          : data.furnishing === 3
          ? t(text.full)
          : null,
    },
  ];

  // Lọc các đặc điểm có giá trị
  const visibleFeatures = features.filter(f => f.value !== null);
  const displayedFeatures = expanded
    ? visibleFeatures
    : visibleFeatures.slice(0, 5);
  console.log('displayedFeatures', displayedFeatures);

  return (
    <View style={styles.container}>
      {displayedFeatures.map((feature, index) => (
        <>
          <View
            key={feature.key || index}
            style={[styles.item, { marginBottom: Spacing.medium }]}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                width: '50%',
              }}
            >
              <Image source={feature.icon} style={styles.icon} />
              <Text style={[styles.title]}>{feature.title}</Text>
            </View>
            <View
              style={{
                width: '50%',
                alignItems: 'center',
              }}
            >
              <Text style={[AppStyles.text, { color: Colors.black }]}>
                {feature.value}
              </Text>
            </View>
          </View>
          <View style={AppStyles.line} />
        </>
      ))}

      {visibleFeatures.length > 5 && (
        <AppButton
          onPress={() => setExpanded(!expanded)}
          title={expanded ? `${t(text.collapse)} ▲` : `${t(text.expand)} ▼`}
          customStyle={[
            {
              width: 150,
              height: 50,
              paddingVertical: 0,
              marginBottom: Spacing.medium,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: Spacing.medium, alignItems: 'center' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.small,
    width: '90%',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: Spacing.small,
  },
  title: {
    fontSize: Fonts.normal,
    color: Colors.black,
  },
  value: {
    fontSize: Fonts.normal,
    color: Colors.black,
    fontWeight: '500',
  },
  toggleBtn: {
    alignItems: 'center',
    marginTop: Spacing.small,
  },
});

export default PropertyDetailsView;
