// src/screens/HomeStack/Home/filterLogic.ts - Logic filter mới đơn giản và ổn định

import { getAllPosts } from '../../../service';
import { HOUSE_TYPE_CATEGORY_MAP } from './houseType_data';

// Interface cho filter parameters
interface FilterParams {
  selectedValue: Record<string, any>;
  selectedSort: { label: string; value: string } | null | undefined;
  searchValue: number;
  location: any;
  page: number;
  ITEMS_PER_PAGE: number;
  append: boolean;
  setFilteredData: (data: any[] | ((prev: any[]) => any[])) => void;
  setTotalResults: (total: number) => void;
  setHasMoreData: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
  setIsInitialLoad: (isInitial: boolean) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loadingMore: boolean) => void;
}

// Hàm xây dựng filter string đơn giản
function buildFilterString(selectedValue: Record<string, any>): string {
  const filters: string[] = [];

  // Kiểm tra selectedValue có tồn tại không
  if (!selectedValue || typeof selectedValue !== 'object') {
    return '';
  }

  // Filter theo loại nhà
  if (
    selectedValue.property_type &&
    Array.isArray(selectedValue.property_type)
  ) {
    const houseTypeIds = selectedValue.property_type
      .map((type: string) => HOUSE_TYPE_CATEGORY_MAP[type])
      .filter(Boolean);

    if (houseTypeIds.length > 0) {
      filters.push(`categoryType=${houseTypeIds.join('|')}`);
    }
  }

  // Filter theo giá
  if (
    selectedValue.price_range &&
    typeof selectedValue.price_range === 'string'
  ) {
    if (selectedValue.price_range === 'Deal') {
      filters.push('unit=3');
    } else if (selectedValue.price_range.includes('-')) {
      const [min, max] = selectedValue.price_range.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        filters.push(`price>=${min * 1e9}`, `price<=${max * 1e9}`);
      }
    }
  }

  // Filter theo diện tích
  if (
    selectedValue.acreage &&
    typeof selectedValue.acreage === 'string' &&
    selectedValue.acreage.includes('-')
  ) {
    const [min, max] = selectedValue.acreage.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filters.push(`area>=${min}`, `area<=${max}`);
    }
  }

  // Filter theo số phòng ngủ
  if (selectedValue.bedrooms && typeof selectedValue.bedrooms === 'string') {
    const bedrooms = parseInt(selectedValue.bedrooms);
    if (!isNaN(bedrooms)) {
      if (bedrooms >= 5) {
        filters.push(`bedrooms>=${bedrooms}`);
      } else {
        filters.push(`bedrooms=${bedrooms}`);
      }
    }
  }

  return filters.join(',');
}

// Hàm xây dựng location filter
function buildLocationFilter(location: any): string {
  if (!location || typeof location !== 'object') return '';

  const locationFilters: string[] = [];
  const { province, district, commune, street } = location;

  if (province?.id) locationFilters.push(`provinceId=${province.id}`);
  if (district?.id) locationFilters.push(`districtId=${district.id}`);
  if (commune?.id) locationFilters.push(`communeId=${commune.id}`);
  if (street?.id) locationFilters.push(`streetId=${street.name}`);

  return locationFilters.length > 0 ? locationFilters.join(',') : '';
}

// Hàm chính để fetch dữ liệu đã filter
export async function fetchFilteredData({
  selectedValue,
  selectedSort,
  searchValue,
  location,
  page = 1,
  ITEMS_PER_PAGE = 10,
  append = false,
  setFilteredData,
  setTotalResults,
  setHasMoreData,
  setCurrentPage,
  setIsInitialLoad,
  setLoading,
  setLoadingMore,
  setRefreshing,
}: FilterParams & { setRefreshing?: (refreshing: boolean) => void }) {
  // Set loading state
  if (page === 1) {
    setLoading(true);
  } else {
    setLoadingMore(true);
  }

  try {
    console.log('🚀 Filter Function Called:');
    console.log('- Selected Value:', selectedValue);
    console.log('- Selected Sort:', selectedSort);
    console.log('- Search Value:', searchValue);
    console.log('- Location:', location);
    console.log('- Page:', page);
    console.log('- Append:', append);

    // Xây dựng filter string
    const userFilters = buildFilterString(selectedValue);
    const locationFilter = buildLocationFilter(location);

    // Xây dựng full filter string
    const typeFilter = `type=${searchValue || 1}`;
    const allFilters = [typeFilter, userFilters, locationFilter]
      .filter(Boolean)
      .join(',');

    // Gọi API với kiểm tra an toàn cho selectedSort
    const sortValue =
      selectedSort && selectedSort.value
        ? selectedSort.value
        : 'createdAt desc';

    console.log('🔍 API Call Parameters:');
    console.log('- Filter String:', allFilters);
    console.log('- Sort Value:', sortValue);
    console.log('- Page:', page);
    console.log('- Items Per Page:', ITEMS_PER_PAGE);
    console.log('- Selected Sort Object:', selectedSort);

    const response = await getAllPosts(
      allFilters,
      sortValue,
      page,
      ITEMS_PER_PAGE,
    );

    console.log('📡 API Response:');
    console.log('- Response:', response);
    console.log('- Result Length:', response?.result?.length || 0);
    console.log('- Total:', response?.total || 0);

    // Xử lý response
    if (response && response.result && Array.isArray(response.result)) {
      if (append) {
        setFilteredData(prevData => {
          const existingIds = new Set(
            prevData.map(item => item.id || item._id),
          );
          const newItems = response.result.filter(
            item => !existingIds.has(item.id || item._id),
          );
          return [...prevData, ...newItems];
        });
      } else {
        setFilteredData(response.result);
      }

      // Cập nhật state
      const total = response.total || response.result.length;
      setTotalResults(total);
      setHasMoreData(response.result.length === ITEMS_PER_PAGE);
      setCurrentPage(page);
      setIsInitialLoad(false);

      console.log('✅ Filter Success:');
      console.log('- Data Length:', response.result.length);
      console.log('- Total Results:', total);
      console.log(
        '- Has More Data:',
        response.result.length === ITEMS_PER_PAGE,
      );
      console.log('- Current Page:', page);
    } else {
      setFilteredData([]);
      setTotalResults(0);
      setHasMoreData(false);
      setCurrentPage(page);
      setIsInitialLoad(false);
    }
  } catch (error) {
    console.error('❌ Filter Error:');
    console.error('- Error:', error);
    console.error('- Error Message:', (error as any)?.message);
    console.error('- Error Stack:', (error as any)?.stack);
  } finally {
    setLoading(false);
    setLoadingMore(false);
    // Reset refreshing state nếu có
    if (setRefreshing) {
      setRefreshing(false);
    }
  }
}
