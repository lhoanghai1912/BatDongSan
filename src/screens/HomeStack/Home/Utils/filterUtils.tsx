import { HOUSE_TYPE_CATEGORY_MAP } from '../houseType_data';

export const buildGridifyFilter = (
  filters: {
    property_type?: string[]; // Thêm property_type
    price_range?: string;
    acreage?: string;
    bedrooms?: string;
    location?: string;
  },
  orderby?: string,
) => {
  console.log('🔍 buildGridifyFilter input:', JSON.stringify(filters, null, 2));

  const parts: string[] = [];

  // Lọc theo loại nhà → categoryType (hỗ trợ cả loaiNha và property_type)
  const houseTypes = filters.property_type;
  if (houseTypes?.length) {
    console.log('Processing houseTypes:', houseTypes);
    const categoryConditions = houseTypes
      .map(key => {
        const categoryId = HOUSE_TYPE_CATEGORY_MAP[key];
        console.log(`Mapping ${key} -> ${categoryId}`);
        return categoryId;
      })
      .filter(Boolean)
      .map(id => `categoryType=${id}`);

    if (categoryConditions.length) {
      console.log('categoryConditions:', categoryConditions);
      parts.push(categoryConditions.join(' | ')); // sử dụng OR
    }
  }

  // Lọc theo giá
  if (filters.price_range) {
    if (filters.price_range === 'Deal') {
      // Lọc theo giá thỏa thuận
      parts.push(`unit=3`);
    } else {
      const [min, max] = filters.price_range.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        parts.push(`price>=${min * 1e9}`, `price<=${max * 1e9}`);
      }
    }
  }

  // Lọc theo diện tích
  if (filters.acreage) {
    const [min, max] = filters.acreage.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      parts.push(`area>=${min}`, `area<=${max}`);
    }
  }

  // Lọc theo số phòng ngủ
  if (filters.bedrooms) {
    const val = parseInt(filters.bedrooms);
    if (!isNaN(val)) {
      if (val >= 5) parts.push(`bedrooms>=${val}`);
      else parts.push(`bedrooms=${val}`);
    }
  }

  const result = parts.length > 0 ? parts.join(',') : '';
  console.log('🎯 buildGridifyFilter result:', result);
  console.log('🎯 parts array:', parts);

  return result;
};
