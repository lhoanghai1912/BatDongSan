import { HOUSE_TYPE_CATEGORY_MAP } from '../houseType_data';

export const buildGridifyFilter = (
  filters: {
    loaiNha?: string[];
    khoangGia?: string;
    dienTich?: string;
    soPhongNgu?: string;
    location?: string;
  },
  orderby?: string, // Thêm tham số orderby
) => {
  const parts: string[] = [];

  // Lọc theo loại nhà → categoryType
  if (filters.loaiNha?.length) {
    const categoryConditions = filters.loaiNha
      .map(key => HOUSE_TYPE_CATEGORY_MAP[key]) // Giả sử HOUSE_TYPE_CATEGORY_MAP là một đối tượng ánh xạ loại nhà
      .filter(Boolean)
      .map(id => `categoryType=${id}`);
    if (categoryConditions.length) {
      parts.push(categoryConditions.join(' | ')); // sử dụng OR
    }
  }

  // Lọc theo giá
  if (filters.khoangGia) {
    if (filters.khoangGia === 'Deal') {
      // Lọc theo giá thỏa thuận
      parts.push(`unit=3`);
    } else {
      const [min, max] = filters.khoangGia.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        parts.push(`price>=${min * 1e9}`, `price<=${max * 1e9}`);
      }
    }
  }

  // Lọc theo diện tích
  if (filters.dienTich) {
    const [min, max] = filters.dienTich.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      parts.push(`area>=${min}`, `area<=${max}`);
    }
  }

  // Lọc theo số phòng ngủ
  if (filters.soPhongNgu) {
    const val = parseInt(filters.soPhongNgu);
    if (!isNaN(val)) {
      if (val >= 5) parts.push(`bedrooms>=${val}`);
      else parts.push(`bedrooms=${val}`);
    }
  }

  return parts.length > 0 ? parts.join(',') : '';
};
