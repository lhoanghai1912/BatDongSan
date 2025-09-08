// src/screens/HomeStack/Home/filterLogic.ts

import { buildGridifyFilter } from './Utils/filterUtils';
import { getAllPosts } from '../../../service';

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
}) {
  if (page === 1) {
    setLoading(true);
  } else {
    setLoadingMore(true);
  }

  try {
    console.log('absc');
    
    const userFilters = buildGridifyFilter(selectedValue, selectedSort.value);
    console.log( 'userFilters',userFilters);
    
    const typeFilter = `type=${searchValue}`;
    let locationFilter = '';

    if (location) {
      const { province, district, commune, street } = location;
      if (province?.id) locationFilter += `,provinceId=${province.id}`;
      if (district?.id) locationFilter += `,districtId=${district.id}`;
      if (commune?.id) locationFilter += `,communeId=${commune.id}`;
      if (street?.id) locationFilter += `,streetId=${street.name}`;
    }

    const fullFilter = userFilters
      ? `${typeFilter},${userFilters}${locationFilter}`
      : `${typeFilter}${locationFilter}`;
    
    console.log('Full Filter String:', fullFilter);

    const res = await getAllPosts(
      fullFilter,
      selectedSort.value,
      page,
      ITEMS_PER_PAGE,
    );
    if (append) {
      setFilteredData(prevData => {
        // Sử dụng đúng key 'id' để kiểm tra trùng lặp
        const existingIds = new Set(prevData.map(item => item.id || item._id));
        const newItems = res.result.filter(item => !existingIds.has(item.id || item._id));
        const merged = [...prevData, ...newItems];
        console.log('[Pagination Debug] prevData:', prevData.length, 'newItems:', newItems.length, 'merged:', merged.length);
        return merged;
      });
    } else {
      console.log('[Pagination Debug] setFilteredData reset:', res.result.length);
      setFilteredData(res.result);
    }

    const total = res.total || res.result.length;
    setTotalResults(total);
    setHasMoreData(res.result.length === ITEMS_PER_PAGE);
    setCurrentPage(page);
    setIsInitialLoad(false);
  } catch (err) {

  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
}
