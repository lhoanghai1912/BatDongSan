import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { caseType, ICONS, text } from '../../../utils/constants';
import { Spacing } from '../../../utils/spacing';
import AppStyles from '../../../components/AppStyle';
import { Colors } from '../../../utils/color';
import { Fonts } from '../../../utils/fontSize';
import ImageCard from '../ImageCard';

import FilterManager from '../../../components/FilterManager';
import SearchModal from '../../../components/Modal/SearchModal';
import { menu } from '../../../service/menu';
import { useTranslation } from 'react-i18next';
import {
  getAcreageData,
  getBedRoomData,
  getHouseTypeData,
  getPriceData,
  getSortData,
} from './houseType_data';
import SortModal from '../../../components/Modal/SortModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchFilteredData as fetchFilteredDataLogic } from './filterLogic';

type PostType = {
  id: string;
  [key: string]: any;
};

const HomeScreen: React.FC = ({}) => {
  // Tất cả hooks phải được gọi ở đầu component
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalType, setModalType] = useState<
    'checkBoxModal' | 'radioButtonModal' | null
  >(null);
  const flatListRef = useRef<FlatList>(null);
  const [modalTitleKey, setModalTitleKey] = useState<string>('');
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSortVisible, setModalSortVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [isSingleValue, setIsSingleValue] = useState(false);
  const [filteredData, setFilteredData] = useState<PostType[]>([]);
  const [searchValue, setSearchValue] = useState<number>(1);
  const [houseType, setHouseType] = useState([]);
  const [selectedLang, setSelectedLang] = useState('en');
  const [location, setLocation] = useState<any>({});
  const [selectedSort, setSelectedSort] = useState<{
    label: string;
    value: string;
  }>({
    label: 'Mới nhất',
    value: `createdAt desc`,
  });

  // Constants sau khi tất cả hooks
  const ITEMS_PER_PAGE = 10;
  const numberResults = filteredData.length.toString();

  const dataFilter = [
    { label: t(text.property_type), key: caseType.PROPERTY_TYPE },
    { label: t(text.price_range), key: caseType.PRICE_RANGE },
    { label: t(text.acreage), key: caseType.ACREAGE },
    { label: t(text.bedrooms), key: caseType.BEDROOMS },
  ];
  const placeholderTexts = [
    t(text.find_project),
    t(text.find_district),
    t(text.find_ward),
    t(text.find_street),
  ];
  // Removed useFocusEffect to prevent duplicate API call on mount
  useEffect(() => {
    console.log('🔄 useEffect triggered - Sort Data Update');
    console.log('- Translation function:', t);
    const newSortData = getSortData(t);
    console.log('- New Sort Data:', newSortData);
    setSelectedSort(prevSort => {
      console.log('- Previous Sort:', prevSort);
      const validOption = newSortData.find(
        option => option.value === prevSort.value,
      );
      const result = validOption || {
        value: 'createdAt desc',
        label: t(text.created_desc),
      };
      console.log('- New Sort Result:', result);
      return result;
    });
  }, [t]);

  const fetchFilteredData = useCallback(
    (page: number = 1, append: boolean = false) => {
      console.log('🏠 HomeScreen calling fetchFilteredData:');
      console.log('- Page:', page);
      console.log('- Append:', append);
      console.log('- Selected Value:', selectedValue);
      console.log('- Selected Sort:', selectedSort);

      fetchFilteredDataLogic({
        selectedValue,
        selectedSort,
        searchValue,
        location,
        page,
        ITEMS_PER_PAGE,
        append,
        setFilteredData,
        setTotalResults,
        setHasMoreData,
        setCurrentPage,
        setIsInitialLoad,
        setLoading,
        setLoadingMore,
        setRefreshing,
      });
    },
    [selectedValue, selectedSort, searchValue, location, ITEMS_PER_PAGE],
  );

  useEffect(() => {
    console.log('🔄 useEffect triggered - Initial Load');
    setCurrentPage(1);
    setHasMoreData(true);
    setIsInitialLoad(true);
    fetchFilteredData(1, false);
  }, [fetchFilteredData]);

  const handleLoadMore = useCallback(() => {
    console.log('📄 handleLoadMore called:');
    console.log('- Loading More:', loadingMore);
    console.log('- Has More Data:', hasMoreData);
    console.log('- Loading:', loading);
    console.log('- Current Page:', currentPage);

    if (!loadingMore && hasMoreData && !loading) {
      const nextPage = currentPage + 1;
      console.log('- Loading page:', nextPage);
      fetchFilteredData(nextPage, true);
    }
  }, [loadingMore, hasMoreData, loading, currentPage, fetchFilteredData]);

  const loadMenu = async () => {
    console.log('🍽️ Loading Menu:');
    console.log('- Selected Language:', selectedLang);
    const data = await menu(selectedLang);
    console.log('- Menu Data:', data);
    setHouseType(data.forSale);
  };
  useEffect(() => {
    console.log('🔄 useEffect triggered - Language Change');
    console.log('- Selected Language:', selectedLang);
    loadMenu();
    selectedSort;
  }, [selectedLang]);

  const openFilterModal = (type: string) => {
    console.log('🔧 Opening Filter Modal:');
    console.log('- Filter Type:', type);
    console.log('- Current Selected Value:', selectedValue);

    setModalTitleKey(type);
    let modalTypeValue: 'checkBoxModal' | 'radioButtonModal' | null = null;
    let modalDataValue: any[] = [];
    let modalTitleValue = '';
    let singleValue = false;
    switch (type) {
      case caseType.PROPERTY_TYPE:
        modalTypeValue = 'checkBoxModal';
        modalDataValue = getHouseTypeData(t);
        modalTitleValue = t(text.modal.chooseHouseType);
        break;
      case caseType.PRICE_RANGE:
        modalTypeValue = 'radioButtonModal';
        modalDataValue = getPriceData(t);
        modalTitleValue = t(text.enter_price);
        break;
      case caseType.ACREAGE:
        modalTypeValue = 'radioButtonModal';
        modalDataValue = getAcreageData(t);
        modalTitleValue = t(text.enter_area);
        break;
      case caseType.BEDROOMS:
        modalTypeValue = 'radioButtonModal';
        modalDataValue = getBedRoomData(t);
        modalTitleValue = t(text.bedrooms);
        singleValue = true;
        break;
      case caseType.SORT:
        modalTypeValue = 'radioButtonModal';
        modalDataValue = getSortData(t);
        modalTitleValue = t(text.enter_sort);
        break;
      default:
        modalTypeValue = null;
        modalDataValue = [];
        modalTitleValue = '';
    }
    setModalType(modalTypeValue);
    setModalData(modalDataValue);
    setModalTitle(modalTitleValue);
    setIsSingleValue(singleValue);
    setModalVisible(!!modalTypeValue);

    console.log('🔧 Modal Configuration:');
    console.log('- Modal Type:', modalTypeValue);
    console.log('- Modal Data Length:', modalDataValue.length);
    console.log('- Modal Title:', modalTitleValue);
    console.log('- Is Single Value:', singleValue);
    console.log('- Modal Visible:', !!modalTypeValue);
  };

  const valueToLabel = React.useCallback(
    (key: string, value: string | string[]) => {
      const mapping: Record<string, any[]> = {
        loaiNha: getHouseTypeData(t),
        khoangGia: getPriceData(t),
        dienTich: getAcreageData(t),
        soPhongNgu: getBedRoomData(t),
        sapXep: getSortData(t),
      };
      const list = mapping[key];
      if (!list) return typeof value === 'string' ? value : value.join(', ');
      if (value === 'deal') return 'Thỏa thuận';
      if (Array.isArray(value)) {
        return value
          .map(v => list.find(item => item.value === v)?.label || v)
          .join(', ');
      } else {
        return list.find(item => item.value === value)?.label || value;
      }
    },
    [t],
  );
  const onRefresh = useCallback(() => {
    console.log('🔄 onRefresh triggered');
    setRefreshing(true);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    // Reset tất cả state
    setSelectedValue({});
    setSelectedSort({ value: 'createdAt desc', label: t(text.created_desc) });
    setLocation({});
    setCurrentPage(1);
    setHasMoreData(true);
    setIsInitialLoad(true);

    // Gọi fetchFilteredData để load lại dữ liệu sau khi reset
    fetchFilteredData(1, false);
  }, [t, fetchFilteredData]);

  const renderPost = ({ item }: { item: PostType }) => {
    console.log('📄 Rendering Post:');
    console.log('- Post ID:', item.id || item._id);
    console.log('- Post Title:', item.title);
    console.log('- Post Price:', item.price);
    console.log('- Post Area:', item.area);
    console.log('- Post Bedrooms:', item.bedrooms);
    console.log('- Post Bathrooms:', item.bathrooms);

    return (
      <>
        <ImageCard post={item} />
        <View style={styles.underLine} />
      </>
    );
  };
  const handleReset = () => {
    console.log('🔄 Filter Reset:');
    console.log('- Modal Title Key:', modalTitleKey);
    console.log('- Previous Selected Value:', selectedValue);

    setSelectedValue(prev => {
      const updated = { ...prev };
      delete updated[modalTitleKey];
      return updated;
    });
    setModalVisible(false);
  };
  const handleSortChange = (selected: any) => {
    console.log('🔄 Sort Changed:');
    console.log('- New Sort:', selected);
    console.log('- Previous Sort:', selectedSort);
    setSelectedSort(selected);
  };
  const renderFooter = () => {
    console.log('📄 Rendering Footer:');
    console.log('- Loading More:', loadingMore);
    console.log('- Has More Data:', hasMoreData);
    console.log('- Is Initial Load:', isInitialLoad);
    console.log('- Filtered Data Length:', filteredData.length);

    if (loadingMore) {
      console.log('- Showing Loading More Indicator');
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#E53935" />
          <Text style={styles.loadingText}>{t('Loading more...')}</Text>
        </View>
      );
    }

    if (!hasMoreData && !isInitialLoad && filteredData.length > 0) {
      console.log('- Showing No More Posts Message');
      return (
        <View style={styles.noMorePostsContainer}>
          <Text style={styles.noMorePostsText}>Hết bài viết</Text>
        </View>
      );
    }

    console.log('- Footer: No content to show');
    return null;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingTop: Spacing.medium }]}>
        <View style={styles.searchBox}>
          <Image source={ICONS.search} style={styles.searchIcon} />
          <TouchableOpacity
            onPress={() => {
              console.log('🔧 Opening Search Modal');
              console.log('- Current Location:', location);
              console.log('- Current Search Value:', searchValue);
              setSearchModalVisible(true);
            }}
            style={{ width: '100%' }}
          >
            <Text style={[styles.searchLabel]}>{t(text.search)}</Text>
            <Text style={[AppStyles.text]}>
              {[
                location?.province?.name,
                location?.district?.name,
                location?.commune?.name,
                location?.street?.name,
              ]
                .filter(Boolean)
                .map(item => item)
                .join(', ') || placeholderTexts[currentIndex]}{' '}
            </Text>
          </TouchableOpacity>
        </View>

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
                  label = valueToLabel(item.key, selected);
                } else {
                  if (
                    item.key === caseType.PRICE_RANGE &&
                    selected !== 'Deal'
                  ) {
                    label = `${selected} ${t(text.bilion)}`;
                  } else if (
                    item.key === caseType.PRICE_RANGE &&
                    selected === 'Deal'
                  ) {
                    label = `${selected}`;
                  } else if (item.key === caseType.ACREAGE) {
                    {
                      label = `${selected} m²`;
                    }
                  } else if (item.key === caseType.BEDROOMS) {
                    {
                      label = `${selected} ${t(text.bedrooms)}`;
                    }
                  }
                }
              }

              return (
                <TouchableOpacity
                  key={item.key || index}
                  style={styles.filterInput}
                  onPress={() => {
                    console.log('🔧 Opening Filter for:', item.key);
                    console.log('- Filter Label:', item.label);
                    console.log(
                      '- Current Selected Value for this key:',
                      selectedValue[item.key],
                    );
                    openFilterModal(item.key);
                  }}
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
            marginBottom: Spacing.medium,
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
              {`${totalResults || numberResults} `}
            </Text>
            <Text style={[AppStyles.text, { color: Colors.darkGray }]}>
              {t('property')}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              console.log('🔧 Opening Sort Modal');
              console.log('- Current Selected Sort:', selectedSort);
              setModalSortVisible(true);
            }}
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
            <Text style={AppStyles.text}>
              {selectedSort.label || `${t(text.sort)}`}
            </Text>
            <Image
              source={ICONS.sort_down}
              style={{ width: 20, height: 20, marginLeft: Spacing.small }}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={filteredData}
          ListEmptyComponent={
            <Text style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}>
              {t(text.no_data)}
            </Text>
          }
          keyExtractor={(item, index) => {
            const key = item.id;
            console.log('🔑 FlatList Key Extractor:', key);
            return key;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderPost}
          onEndReached={() => {
            console.log('📄 FlatList onEndReached triggered');
            handleLoadMore();
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={5}
          initialNumToRender={5}
          // Đã loại bỏ getItemLayout để tránh lỗi layout nếu item không cố định
        />
      </View>

      <FilterManager
        visible={modalVisible && !!modalType}
        type={modalType || 'checkBoxModal'}
        title={modalTitle}
        data={modalData}
        isSingleValue={isSingleValue}
        selected={
          modalType === 'checkBoxModal'
            ? (selectedValue[modalTitleKey] as string[]) || []
            : (selectedValue[modalTitleKey] as string) || ''
        }
        onClose={() => {
          console.log('❌ Filter Modal Closed');
          setModalVisible(false);
        }}
        onReset={() => handleReset()}
        onApplyFilter={value => {
          console.log('🎯 Filter Applied:');
          console.log('- Modal Title Key:', modalTitleKey);
          console.log('- Filter Value:', value);
          console.log('- Previous Selected Value:', selectedValue);

          setSelectedValue(prev => ({
            ...prev,
            [modalTitleKey]: value,
          }));
          setModalVisible(false);
        }}
      />

      <SortModal
        visible={modalSortVisible}
        selected={selectedSort}
        onSelect={selectedSort => handleSortChange(selectedSort)}
        onClose={() => {
          console.log('❌ Sort Modal Closed');
          setModalSortVisible(false);
        }}
      />
      <SearchModal
        visible={searchModalVisible}
        onClose={() => {
          console.log('❌ Search Modal Closed');
          setSearchModalVisible(false);
        }}
        onSearch={(value, locationSearchValue) => {
          console.log('🔍 Search Performed:');
          console.log('- Search Value:', value);
          console.log('- Location Search Value:', locationSearchValue);
          console.log('- Previous Location:', location);
          console.log('- Previous Search Value:', searchValue);

          setLocation(locationSearchValue);
          setSearchValue(value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.medium,
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
  // Add these to your styles object
  footerLoader: {
    paddingVertical: Spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.small,
    fontSize: Fonts.small,
    color: Colors.darkGray,
  },

  noMorePostsContainer: {
    paddingVertical: Spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMorePostsText: {
    fontSize: Fonts.normal,
    color: Colors.darkGray,
    fontWeight: '500',
  },
});

export default HomeScreen;
