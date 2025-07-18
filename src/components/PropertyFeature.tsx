import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ICONS } from '../utils/constants'; // Thêm ICONS vào đúng đường dẫn
import { Fonts } from '../utils/fontSize';
import { Colors } from '../utils/color';
import { Spacing } from '../utils/spacing';
import AppStyles from './AppStyle';
import AppButton from './AppButton';

const PropertyDetailsView = ({ data }: { data: any }) => {
  const [expanded, setExpanded] = useState(false);

  // Mảng các đặc điểm cần hiển thị
  const features = [
    {
      key: 'price',
      title: 'Mức giá',
      icon: ICONS.price,
      value: data.price ? `${(data.price / 1e9).toFixed(2)} tỷ` : null,
    },
    {
      id: data.id,

      key: 'area',
      title: 'Diện tích',
      icon: ICONS.expand,
      value: data.area ? `${data.area} m²` : null,
    },
    {
      key: 'houseOrientation',
      title: 'Hướng nhà',
      icon: ICONS.direction,
      value:
        data.houseOrientation === 1
          ? 'Đông'
          : data.houseOrientation === 2
          ? 'Tây'
          : data.houseOrientation === 3
          ? 'Nam'
          : data.houseOrientation === 4
          ? 'Bắc'
          : data.houseOrientation === 5
          ? 'Đông Bắc'
          : data.houseOrientation === 6
          ? 'Tây Bắc'
          : data.houseOrientation === 7
          ? 'Đông Nam'
          : data.houseOrientation === 8
          ? 'Tây Nam'
          : null,
    },
    {
      key: 'bedrooms',
      title: 'Phòng ngủ',
      icon: ICONS.bed,
      value: data.bedrooms ? `${data.bedrooms}` : null,
    },
    {
      key: 'bathrooms',
      title: 'Phòng tắm',
      icon: ICONS.bath,
      value: data.bathrooms ? `${data.bathrooms}` : null,
    },
    {
      key: 'furnishing',
      title: 'Nội thất',
      icon: ICONS.furniture,
      value:
        data.furnishing === 1
          ? 'Chưa có'
          : data.furnishing === 2
          ? 'Có'
          : data.furnishing === 3
          ? 'Đầy đủ'
          : null,
    },
  ];

  // Lọc các đặc điểm có giá trị
  const visibleFeatures = features.filter(f => f.value !== null);
  const displayedFeatures = expanded
    ? visibleFeatures
    : visibleFeatures.slice(0, 5);

  return (
    <View style={styles.container}>
      {displayedFeatures.map((feature, index) => (
        <>
          <View
            key={feature.key + index}
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
          title={expanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
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
