// src/screens/Home/utils/filterUtils.ts

import { HOUSE_TYPE_CATEGORY_MAP } from '../houseType_data';

export const buildGridifyFilter = (filters: {
  loaiNha?: string[];
  khoangGia?: string;
  dienTich?: string;
  soPhongNgu?: string;
}) => {
  const parts: string[] = [];

  // Lọc theo loại nhà → categoryType
  if (filters.loaiNha?.length) {
    const categoryConditions = filters.loaiNha
      .map(key => HOUSE_TYPE_CATEGORY_MAP[key])
      .filter(Boolean)
      .map(id => `categoryType=${id}`);
    if (categoryConditions.length) {
      parts.push(categoryConditions.join(' | ')); // sử dụng OR
    }
  }

  // Lọc theo giá
  if (filters.khoangGia) {
    const [min, max] = filters.khoangGia.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      parts.push(`price>=${min * 1e9}`, `price<=${max * 1e9}`);
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
