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
import SearchModal from '../../components/Modal/SearchModal';
import { menu } from '../../service/menu';
import LanguageSelector from '../../components/LanguageSelector';

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

  const [modalTitleKey, setModalTitleKey] = useState<string>('');
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [isSingleValue, setIsSingleValue] = useState(false);
  const [filteredData, setFilteredData] = useState<PostType[]>([]);
  const [seachValue, setSearchValue] = useState('');
  const [houseType, setHouseType] = useState([]);
  const numberResults = filteredData.length.toString();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState('vi');

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

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...postData];

      // Lọc theo loại nhà
      if (selectedValue.loaiNha?.length) {
        console.log('loai nha', selectedValue.loaiNha);
        console.log(
          ' data loai nha',
          filtered.filter(post =>
            selectedValue.loaiNha.includes(post.info_main.type_property),
          ),
        );

        filtered = filtered.filter(post =>
          selectedValue.loaiNha.includes(post.info_main.type_property),
        );
      }

      // Lọc theo khoảng giá (giá trong post.price, tính theo tỷ)
      if (selectedValue.khoangGia) {
        const [min, max] = selectedValue.khoangGia
          .split('-')
          .map(val => Number(val) * 1_000_000_000);
        console.log(min, ' min   ; ', max, '  max');

        filtered = filtered.filter(
          post => post.info_main.price >= min && post.info_main.price <= max,
        );
      }

      // Lọc theo diện tích (diện tích trong post.acreage, đơn vị m²)
      if (selectedValue.dienTich) {
        const [min, max] = selectedValue.dienTich.split('-').map(Number);
        console.log('dien tich', min, max);

        filtered = filtered.filter(
          post =>
            post.info_main.acreage >= min && post.info_main.acreage <= max,
        );
      }

      // Lọc theo số phòng ngủ (post.bedrooms là số)
      if (selectedValue.soPhongNgu) {
        const val = parseInt(selectedValue.soPhongNgu);

        if (!isNaN(val)) {
          if (val < 5) {
            filtered = filtered.filter(
              post => post.info_other.bedrooms === val,
            );
          } else {
            filtered = filtered.filter(post => post.info_other.bedrooms >= val);
          }
        }
      }

      setFilteredData(filtered);
    };

    applyFilters();
  }, [selectedValue, postData]);

  useEffect(() => {
    const loadMenu = async () => {
      const data = await menu(selectedLang);
      setHouseType(data.forSale);
    };
    loadMenu();
  }, [selectedLang]);

  useEffect(() => {
    console.log('✅ houseType updated:', houseType);
  }, [houseType]);

  const openFilterModal = (type: string) => {
    setModalTitleKey(type);
    switch (type) {
      case 'loaiNha':
        setModalType('checkBoxModal');
        setModalData([
          'Chung cư',
          'Nhà riêng',
          'Biệt thự',
          'Căn hộ chung cư',
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
          { label: 'trên 60 tỷ', value: '60-100' },
        ]);
        setModalTitle('Chọn khoảng giá');
        break;
      case 'dienTich':
        setModalType('radioButtonModal');
        setModalData([
          { label: 'Dưới 30m²', value: '0-30' },
          { label: '30-50m²', value: '30-50' },
          { label: '50-80m²', value: '50-80' },
          { label: '80-100m²', value: '80-100' },
          { label: '100-150m²', value: '100-150' },
          { label: '150-200m²', value: '150-200' },
          { label: '200-250m²', value: '200-250' },
          { label: '250-300m²', value: '250-300' },
          { label: '300-500m²', value: '300-500' },
          { label: '500-800m²', value: '500-800' },
          { label: 'trên 800m²', value: '800-999999999999' },
        ]);
        setModalTitle('Chọn diện tích');
        break;
      case 'soPhongNgu':
        setModalType('radioButtonModal');
        setModalData([
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5+', value: '5' },
        ]);
        setModalTitle('Chọn số phòng ngủ');
        setIsSingleValue(true); // ✅ thêm biến flag

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
  const handleReset = () => {
    setSelectedValue(prev => {
      const updated = { ...prev };
      delete updated[modalTitleKey]; // Xoá giá trị filter hiện tại
      return updated;
    });
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Image source={ICONS.search} style={styles.searchIcon} />
          <TouchableOpacity
            onPress={() => setSearchModalVisible(true)}
            style={{ width: '100%' }}
          >
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
            {dataFilter.map((item, index) => {
              const selected = selectedValue[item.key];

              let label = item.label;
              if (selected) {
                if (Array.isArray(selected)) {
                  label = `${selected.join(', ')}`;
                } else {
                  if (item.key === 'khoangGia') {
                    label = `${selected} tỷ`;
                  } else if (item.key === 'dienTich') {
                    {
                      label = `${selected} m²`;
                    }
                  } else if (item.key === 'soPhongNgu') {
                    {
                      label = `${selected} ngủ`;
                    }
                  }
                }
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.filterInput}
                  onPress={() => openFilterModal(item.key)}
                >
                  <Text
                    style={[AppStyles.text, { flexShrink: 1 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {label}
                  </Text>
                  <Image source={ICONS.down} style={AppStyles.icon} />
                </TouchableOpacity>
              );
            })}
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
          <TouchableOpacity
            style={{ padding: 10, alignSelf: 'flex-end' }}
            onPress={() => setLangModalVisible(true)}
          >
            <Text style={{ color: Colors.primary }}>🌐 Ngôn ngữ</Text>
          </TouchableOpacity>
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
          data={filteredData}
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
          isSingleValue={isSingleValue} // ✅ Thêm dòng này
          selected={selectedValue[modalTitleKey] || ''} // ✅ fix đúng kiểu
          onClose={() => setModalVisible(false)}
          onReset={() => handleReset()}
          onApplyFilter={value => {
            setSelectedValue(prev => ({
              ...prev,
              [modalTitleKey]: value,
            }));
            setModalVisible(false);
          }}
        />
      )}
      <LanguageSelector
        visible={langModalVisible}
        selectedLang={selectedLang}
        onSelect={lang => {
          setSelectedLang(lang);
        }}
        onClose={() => setLangModalVisible(false)}
      />
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={value => setSearchValue(value)}
      />
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
    maxWidth: 300,
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
