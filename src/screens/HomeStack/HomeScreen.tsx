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
  ActivityIndicator,
} from 'react-native';
import { ICONS } from '../../utils/constants';
import { Spacing } from '../../utils/spacing';
import AppStyles from '../../components/AppStyle';
import { Colors } from '../../utils/color';
import { Fonts } from '../../utils/fontSize';
import ImageCard from './ImageCard';
import { getAllPosts } from '../../service';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/reducers/userSlice';
import AppButton from '../../components/AppButton';
import { setLoading } from '../../store/reducers/loadingSlice';
import FilterManager from '../../components/FilterManager';

const dataFilter = [
  { label: 'Loại nhà đất', key: 'loaiNha' },
  { label: 'Khoảng giá', key: 'khoangGia' },
  { label: 'Diện tích', key: 'dienTich' },
  { label: 'Số phòng ngủ', key: 'soPhongNgu' },
  // 'Hướng nhà',
  // 'Hướng ban công',
  // 'Tin có ảnh / video',
];
const placeholderTexts = [
  'Tìm dự án',
  'Tìm quận/huyện',
  'Tìm phường/xã',
  'Tìm đường phố',
];

type PostType = {
  _id: string;
  // add other properties as needed
  [key: string]: any;
};

const HomeScreen: React.FC = ({}) => {
  const dispatch = useDispatch();
  const { userData, token } = useSelector((state: any) => state.user);

  const [postData, setPostsData] = useState<PostType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalType, setModalType] = useState<
    'checkBoxModal' | 'radioButtonModal' | null
  >(null);

  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string[] | string>([]);
  const [loading, setLoading] = useState(false);
  const numberResults = postData.length.toString();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % placeholderTexts.length);
    }, 1000); // đổi text mỗi 1s

    return () => clearInterval(interval); // clear khi unmount
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await getAllPosts(); // Gọi API bài viết
        console.log('data', data);

        setPostsData(data.metadata.docs);
      } catch (error) {
        console.log('Lỗi khi tải bài viết:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  const openFilterModal = (type: string) => {
    switch (type) {
      case 'loaiNha':
        setModalType('checkBoxModal');
        setModalData([
          'Chung cư',
          'Nhà riêng',
          'Biệt thự',
          'Chung cư mini, căn hộ dịch vụ',
          'Nhà biệt thự, liền kề',
          'Nhà mặt phố',
          'Nhà trọ, phòng trọ',
          'Shophouse, nhà phố thương mại',
          'Văn phòng',
          'Cửa hàng, kiot',
          'Kho, nhà xưởng, đất',
          'Bất động sản khác',
        ]);
        setModalTitle('Chọn loại nhà');
        break;
      case 'huongNha':
        setModalType('checkBoxModal');
        setModalData([
          'Đông',
          'Tây',
          'Nam',
          'Bắc',
          'Đông Bắc',
          'Đông Nam',
          'Tây Bắc',
          'Tây Nam',
        ]);
        setModalTitle('Chọn hướng nhà');
        break;
      case 'khoangGia':
        setModalType('radioButtonModal');
        setModalData([
          { label: 'Dưới 500 triệu', value: '0-0.5' },
          { label: '500 - 800 triệu', value: '0.5-0.8' },
          { label: '800 triệu - 1 tỷ', value: '0.8-1' },
          { label: '1 - 2 tỷ', value: '1-2' },
          { label: '2 - 3 tỷ', value: '2-3' },
          { label: '3 - 5 tỷ', value: '3-5' },
          { label: '5 - 7 tỷ', value: '5-7' },
          { label: '7 - 10 tỷ', value: '7-10' },
          { label: '10 - 20 tỷ', value: '10-20' },
          { label: '20 - 30 tỷ', value: '20-30' },
          { label: '30 - 40 tỷ', value: '30-40' },
          { label: '40 - 60 tỷ', value: '40-60' },
          { label: 'trên 60 tỷ', value: '100' },
          { label: 'Thỏa thuận', value: 'deal' },
        ]);
        setModalTitle('Chọn khoảng giá');
        break;
      case 'dienTich':
        setModalType('radioButtonModal');
        setModalData([
          { label: 'Dưới 30m²', value: '0-30' },
          { label: '30-50m²', value: '30-50' },
          { label: 'Trên 80m²', value: '80+' },
        ]);
        setModalTitle('Chọn diện tích');
        break;
      case 'soPhongNgu':
        setModalType('radioButtonModal');
        setModalData([
          { label: '1', value: '0-1' },
          { label: '2', value: '1-2' },
          { label: '3', value: '2-3' },
          { label: '4', value: '3-4' },
          { label: '5+', value: '5' },
        ]);
        setModalTitle('Chọn số phòng ngủ');
        break;
    }
    setModalVisible(true);
  };

  const renderPost = ({ item }: { item: PostType }) => {
    return (
      <>
        <ImageCard post={item} />
        <View style={styles.underLine} />
      </>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Image source={ICONS.search} style={styles.searchIcon} />
          <TouchableOpacity style={{ width: '100%' }}>
            <Text style={[styles.searchLabel]}>Tìm kiếm</Text>
            <Text style={[AppStyles.text]}>
              {placeholderTexts[currentIndex]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔽 Bộ lọc */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          >
            {dataFilter.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.filterInput}
                onPress={() => openFilterModal(item.key)}
              >
                <Text style={AppStyles.text}>{item.label}</Text>
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
            marginBottom: Spacing.xxlarge,
            paddingHorizontal: Spacing.medium,
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
          data={postData}
          ListEmptyComponent={
            <Text style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}>
              Không có dữ liệu phù hợp
            </Text>
          }
          keyExtractor={item => item._id}
          // renderItem={({ item }) => <ImageCard post={item} />}
          renderItem={renderPost}
        />
      </View>
      {/* <AppButton title="Logout" onPress={() => handleLogout()}></AppButton> */}
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
      {modalType && (
        <FilterManager
          visible={modalVisible}
          type={modalType}
          title={modalTitle}
          data={modalData}
          selected={selectedValue}
          onClose={() => setModalVisible(false)}
          onApplyFilter={value => {
            setSelectedValue(value);
            setModalVisible(false);
            // TODO: lọc dữ liệu theo `value`
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  header: {
    flex: 0.2,
    paddingHorizontal: Spacing.medium,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Spacing.medium,
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
    width: 40,
    height: 40,
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
  underLine: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    marginVertical: Spacing.medium,
    width: '100%',
  },
});

export default HomeScreen;
