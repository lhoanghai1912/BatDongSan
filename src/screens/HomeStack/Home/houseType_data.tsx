// src/screens/Home/utils/houseType_data.ts
import { ICONS, text } from '../../../utils/constants';

export const getHouseTypeData = (t: (key: string) => string) => [
  { icon: ICONS.apartment, label: t(text.modal.houseType.apartment) },
  { icon: ICONS.mini_apartment, label: t(text.modal.houseType.mini_apartment) },
  { icon: ICONS.house, label: t(text.modal.houseType.house) },
  { icon: ICONS.villa, label: t(text.modal.houseType.villa) },
  { icon: ICONS.roadhouse, label: t(text.modal.houseType.roadhouse) },
  { icon: ICONS.shophouse, label: t(text.modal.houseType.shophouse) },
  { icon: ICONS.projectLand, label: t(text.modal.houseType.projectLand) },
  { icon: ICONS.land, label: t(text.modal.houseType.land) },
  { icon: ICONS.farm, label: t(text.modal.houseType.farm) },
  { icon: ICONS.condotel, label: t(text.modal.houseType.condotel) },
  { icon: ICONS.warehouse, label: t(text.modal.houseType.warehouse) },
  { icon: ICONS.other, label: t(text.modal.houseType.other) },
];

export const getPriceData = (t: (key: string) => string) => [
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
];

export const getAcreageData = (t: (key: string) => string) => [
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
];

export const getBedRoomData = (t: (key: string) => string) => [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5+', value: '5' },
];
