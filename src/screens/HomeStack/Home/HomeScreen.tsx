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
import { ICONS, text } from '../../../utils/constants';
import { Spacing } from '../../../utils/spacing';
import AppStyles from '../../../components/AppStyle';
import { Colors } from '../../../utils/color';
import { Fonts } from '../../../utils/fontSize';
import ImageCard from '../ImageCard';
import { getAllPosts } from '../../../service';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/reducers/userSlice';
import AppButton from '../../../components/AppButton';
import { setLoading } from '../../../store/reducers/loadingSlice';
import FilterManager from '../../../components/FilterManager';
import SearchModal from '../../../components/Modal/SearchModal';
import { menu } from '../../../service/menu';
import LanguageSelector from '../../../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/i18n';
import {
  getAcreageData,
  getBedRoomData,
  getHouseTypeData,
  getPriceData,
} from './houseType_data';

const HomeScreen: React.FC = ({}) => {
  const dispatch = useDispatch();
  const { userData, token } = useSelector((state: any) => state.user);
  const { t } = useTranslation();

  const [postData, setPostsData] = useState<PostType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalType, setModalType] = useState<
    'checkBoxModal' | 'radioButtonModal' | null
  >(null);

  const dataFilter = [
    { label: t(text.property_type), key: 'loaiNha' },
    { label: t(text.price_range), key: 'khoangGia' },
    { label: t(text.acreage), key: 'dienTich' },
    { label: t(text.bedrooms), key: 'soPhongNgu' },
    // 'Hướng nhà',
    // 'Hướng ban công',
    // 'Tin có ảnh / video',
  ];
  const placeholderTexts = [
    t(text.find_project),
    t(text.find_district),
    t(text.find_ward),
    t(text.find_street),
  ];

  type PostType = {
    _id: string;
    // add other properties as needed
    [key: string]: any;
  };

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
        setPostsData(data.result);
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
        setModalData(getHouseTypeData(t));
        setModalTitle(t(text.modal.chooseHouseType));
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
        setModalData([getPriceData(t)]);
        setModalTitle('Chọn khoảng giá');
        break;
      case 'dienTich':
        setModalType('radioButtonModal');
        setModalData([getAcreageData(t)]);
        setModalTitle('Chọn diện tích');
        break;
      case 'soPhongNgu':
        setModalType('radioButtonModal');
        setModalData([getBedRoomData(t)]);
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

  const handleLanguageChange = async (newLang: string) => {
    console.log('newlang', newLang);

    await i18n.changeLanguage(newLang);
    setSelectedLang(newLang);
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
            <Text style={[styles.searchLabel]}>{t(text.search)}</Text>
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
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                AppStyles.text,
                { color: Colors.darkGray, fontWeight: 'bold' },
              ]}
            >
              {`${numberResults} `}
            </Text>
            <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
              {t('property')}
            </Text>
          </View>
          <TouchableOpacity
            style={{ padding: 10, alignSelf: 'flex-end' }}
            onPress={() => setLangModalVisible(true)}
          >
            <Text style={[AppStyles.text, { color: Colors.primary }]}>{`🌐 ${t(
              text.language,
            )}`}</Text>
          </TouchableOpacity>
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
            <Text style={AppStyles.text}>{t(text.arrange)}</Text>
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
          keyExtractor={item => item.id}
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
          handleLanguageChange(lang);
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
