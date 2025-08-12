import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { fetchFilteredData as fetchFilteredDataLogic } from './filterLogic';

const HomeScreen: React.FC = ({}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalType, setModalType] = useState<
    'checkBoxModal' | 'radioButtonModal' | null
  >(null);

  const dataFilter = React.useMemo(
    () => [
      { label: t(text.property_type), key: caseType.PROPERTY_TYPE },
      { label: t(text.price_range), key: 'khoangGia' },
      { label: t(text.acreage), key: 'dienTich' },
      { label: t(text.bedrooms), key: 'soPhongNgu' },
    ],
    [t],
  );
  const placeholderTexts = React.useMemo(
    () => [
      t(text.find_project),
      t(text.find_district),
      t(text.find_ward),
      t(text.find_street),
    ],
    [t],
  );

  type PostType = {
    _id: string;
    [key: string]: any;
  };
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
  const numberResults = filteredData.length.toString();
  const [selectedLang, setSelectedLang] = useState('en');
  const [location, setLocation] = useState<any>({});
  const [selectedSort, setSelectedSort] = useState<{
    label: string;
    value: string;
  }>({
    label: t(text.created_desc),
    value: `createdAt desc`,
  });
  // Removed useFocusEffect to prevent duplicate API call on mount
  useEffect(() => {
    const newSortData = getSortData(t);
    setSelectedSort(prevSort => {
      const validOption = newSortData.find(
        option => option.value === prevSort.value,
      );
      return validOption || { value: '', label: '' };
    });
  }, [t]);

  const fetchFilteredData = (page: number = 1, append: boolean = false) => {
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
    });
  };

  useEffect(() => {
    setCurrentPage(1);
    setHasMoreData(true);
    setIsInitialLoad(true);
    fetchFilteredData(1, false);
  }, [selectedValue, searchValue, selectedSort, location]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMoreData && !loading) {
      const nextPage = currentPage + 1;
      fetchFilteredData(nextPage, true);
    }
  }, [loadingMore, hasMoreData, loading, currentPage]);

  const loadMenu = async () => {
    const data = await menu(selectedLang);
    setHouseType(data.forSale);
  };
  useEffect(() => {
    loadMenu();
    selectedSort;
  }, [selectedLang]);

  const openFilterModal = (type: string) => {
    console.log('key:', type);

    setModalTitleKey(type);
    switch (type) {
      case caseType.PROPERTY_TYPE:
        setModalType('checkBoxModal');
        setModalData(getHouseTypeData(t));
        setModalTitle(t(text.modal.chooseHouseType));
        break;

      case caseType.PRICE_RANGE:
        setModalType('radioButtonModal');
        setModalData(getPriceData(t));
        setModalTitle(t(text.enter_price));
        break;
      case caseType.ACREAGE:
        setModalType('radioButtonModal');
        setModalData(getAcreageData(t));
        setModalTitle(t(text.enter_area));
        break;
      case caseType.BEDROOMS:
        setModalType('radioButtonModal');
        console.log('chay den modal type', modalType);

        setModalData(getBedRoomData(t));
        console.log('chay den modal dataa', modalData);

        setModalTitle(t(text.bedrooms));
        console.log('chay den modal title', modalTitle);

        setIsSingleValue(true);
        console.log('chay den issinglevalue', isSingleValue);

        break;
      case caseType.SORT:
        setModalType('radioButtonModal');
        setModalData(getSortData(t));
        setModalTitle(t(text.enter_sort));
    }
    setModalVisible(true);
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
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    setSelectedValue({});
    setSelectedSort({ value: 'createdAt desc', label: t(text.created_desc) });
    setLocation({});
    setCurrentPage(1);
    setHasMoreData(true);
    setIsInitialLoad(true);
    // Removed fetchFilteredData to avoid double API call
  }, [searchValue]);

  const MemoImageCard = React.memo(ImageCard, (prevProps, nextProps) => {
    // So sánh shallow post
    return (
      prevProps.post._id === nextProps.post._id &&
      JSON.stringify(prevProps.post) === JSON.stringify(nextProps.post)
    );
  });
  const renderPost = React.useCallback(
    ({ item }: { item: PostType }) => <MemoImageCard post={item} />,
    [],
  );
  const handleReset = () => {
    setSelectedValue(prev => {
      const updated = { ...prev };
      delete updated[modalTitleKey];
      return updated;
    });
    setModalVisible(false);
  };
  const handleSortChange = (selected: any) => {
    setSelectedSort(selected);
  };
  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#E53935" />
          <Text style={styles.loadingText}>{t('Loading more...')}</Text>
        </View>
      );
    }

    if (!hasMoreData && !isInitialLoad && filteredData.length > 0) {
      return (
        <View style={styles.noMorePostsContainer}>
          <Text style={styles.noMorePostsText}>Hết bài viết</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingTop: Spacing.medium }]}>
        <View style={styles.searchBox}>
          <Image source={ICONS.search} style={styles.searchIcon} />
          <TouchableOpacity
            onPress={() => setSearchModalVisible(true)}
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
                console.log('selected', selected);

                if (Array.isArray(selected)) {
                  label = valueToLabel(item.key, selected);
                } else {
                  if (item.key === 'khoangGia' && selected !== 'Deal') {
                    label = `${selected} ${t(text.bilion)}`;
                  } else if (item.key === 'khoangGia' && selected === 'Deal') {
                    label = `${selected}`;
                  } else if (item.key === 'dienTich') {
                    {
                      label = `${selected} m²`;
                    }
                  } else if (item.key === 'soPhongNgu') {
                    {
                      label = `${selected} ${t(text.bedrooms)}`;
                    }
                  }
                }
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.filterInput}
                  onPress={() => {
                    console.log('pressss', item), openFilterModal(item.key);
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
            onPress={() => setModalSortVisible(true)}
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
          keyExtractor={useCallback(
            item => (item._id ? item._id.toString() : `${Math.random()}`),
            [],
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderPost}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          getItemLayout={useCallback(
            (data, index) => ({
              length: 120,
              offset: 120 * index,
              index,
            }),
            [],
          )}
        />
      </View>

      {modalType && (
        <FilterManager
          visible={modalVisible}
          type={modalType}
          title={modalTitle}
          data={modalData}
          isSingleValue={isSingleValue} //
          selected={selectedValue[modalTitleKey] || ''}
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

      <SortModal
        key={selectedLang}
        visible={modalSortVisible}
        selected={selectedSort}
        onSelect={selectedSort => handleSortChange(selectedSort)}
        onClose={() => setModalSortVisible(false)}
      />
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={(value, locationSearchValue) => {
          console.log('searchlocation', locationSearchValue),
            setLocation(locationSearchValue),
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
