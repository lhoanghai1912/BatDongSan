import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { ICONS } from '../../utils/constants';
import { Spacing } from '../../utils/spacing';
import AppStyles from '../../components/AppStyle';
import { Colors } from '../../utils/color';
import { Fonts } from '../../utils/fontSize';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import ImageCard from './ImageCard';
import { PROPERTY_IMAGES } from './User/images.data';
import { getAllImages, getAllPosts } from '../../service';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/reducers/userSlice';
import AppButton from '../../components/AppButton';

const dataFilter = [
  'Loại nhà đất',
  'Khoảng giá',
  'Diện tích',
  'Số phòng ngủ',
  'Hướng nhà',
  'Hướng ban công',
  'Tin có ảnh / video',
];

type PostType = {
  _id: string;
  // add other properties as needed
  [key: string]: any;
};

const HomeScreen: React.FC = ({}) => {
  const numberResults = '99999';
  const dispatch = useDispatch();

  const [postData, setPostsData] = useState<PostType[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await getAllPosts(); // Gọi API bài viết
        console.log('data', data);

        setPostsData(data.metadata.docs);
      } catch (error) {
        console.log('Lỗi khi tải bài viết:', error);
      }
    };

    loadNews();
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* 🔍 Thanh tìm kiếm */}
        <View style={styles.searchBox}>
          <Image source={ICONS.search} style={styles.searchIcon} />
          <View>
            <Text style={styles.searchLabel}>Tìm kiếm</Text>
            <TextInput
              style={styles.searchPlaceholder}
              placeholder="Tìm phường, xã"
            ></TextInput>
          </View>
        </View>

        {/* 🔽 Bộ lọc */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          >
            {dataFilter.map((label, index) => (
              <TouchableOpacity key={index} style={styles.filterInput}>
                <Text style={AppStyles.text}>{label}</Text>
                <Image source={ICONS.down} style={AppStyles.icon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.body}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                AppStyles.text,
                { color: Colors.darkGray, fontWeight: 'bold' },
              ]}
            >
              {numberResults}
            </Text>
            <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
              {` bất động sản`}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              borderColor: Colors.Gray,
              borderWidth: 1,
              borderRadius: 20,
              paddingVertical: Spacing.small,
              paddingHorizontal: Spacing.medium,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={AppStyles.text}>Sắp xếp</Text>
            <Image
              source={ICONS.sort_down}
              style={{ width: 20, height: 20, marginLeft: Spacing.small }}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={postData || []}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <ImageCard post={item} />}
        />
      </View>
      <AppButton title="Logout" onPress={() => handleLogout()}></AppButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  header: {
    flex: 0.25,
    paddingHorizontal: Spacing.medium,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Spacing.medium,
    paddingHorizontal: Spacing.medium,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
    marginHorizontal: Spacing.small,
    marginRight: 12,
  },
  searchLabel: {
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    color: '#000',
  },
  searchPlaceholder: {
    fontSize: Fonts.normal,
    color: '#888',
  },
  itemCard: { borderBottomColor: Colors.Gray, borderBottomWidth: 2 },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterInput: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Spacing.small,
    marginRight: Spacing.small,
    marginBottom: Spacing.small,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
});

export default HomeScreen;
