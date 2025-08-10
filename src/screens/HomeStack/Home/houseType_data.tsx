// src/screens/Home/utils/houseType_data.ts
import { ICONS, text } from '../../../utils/constants';
export const getHouseTypeData = (t: (key: string) => string) => [
  {
    value: `apartment`,
    icon: ICONS.apartment,
    label: t(text.modal.houseType.apartment),
  },
  {
    value: `mini_apartment`,
    icon: ICONS.mini_apartment,
    label: t(text.modal.houseType.mini_apartment),
  },
  { value: `house`, icon: ICONS.house, label: t(text.modal.houseType.house) },
  { value: `villa`, icon: ICONS.villa, label: t(text.modal.houseType.villa) },
  {
    value: `roadhouse`,
    icon: ICONS.roadhouse,
    label: t(text.modal.houseType.roadhouse),
  },
  {
    value: `shophouse`,
    icon: ICONS.shophouse,
    label: t(text.modal.houseType.shophouse),
  },
  {
    value: `projectLand`,
    icon: ICONS.projectLand,
    label: t(text.modal.houseType.projectLand),
  },
  { value: `land`, icon: ICONS.land, label: t(text.modal.houseType.land) },
  { value: `farm`, icon: ICONS.farm, label: t(text.modal.houseType.farm) },
  {
    value: `condotel`,
    icon: ICONS.condotel,
    label: t(text.modal.houseType.condotel),
  },
  {
    value: `warehouse`,
    icon: ICONS.warehouse,
    label: t(text.modal.houseType.warehouse),
  },
  { value: `other`, icon: ICONS.other, label: t(text.modal.houseType.other) },
];

export const getPriceData = (t: (key: string) => string) => [
  { label: `${t(text.under)} 500 ${t(text.milion)}`, value: `0-0.5` },
  { label: `500 - 800 ${t(text.milion)}`, value: `0.5-0.8` },
  { label: `800 ${t(text.milion)} - 1 ${t(text.bilion)}`, value: `0.8-1` },
  { label: `1 - 2 ${t(text.bilion)}`, value: `1-2` },
  { label: `2 - 3 ${t(text.bilion)}`, value: `2-3` },
  { label: `3 - 5 ${t(text.bilion)}`, value: `3-5` },
  { label: `5 - 7 ${t(text.bilion)}`, value: `5-7` },
  { label: `7 - 10 ${t(text.bilion)}`, value: `7-10` },
  { label: `10 - 20 ${t(text.bilion)}`, value: `10-20` },
  { label: `20 - 30 ${t(text.bilion)}`, value: `20-30` },
  { label: `30 - 40 ${t(text.bilion)}`, value: `30-40` },
  { label: `40 - 60 ${t(text.bilion)}`, value: `40-60` },
  { label: `trên 60 ${t(text.bilion)}`, value: `60-100` },
  { label: `${t(text.deal)}`, value: `Deal` }, // Thêm lựa chọn "Thỏa thuận"
];

export const getAcreageData = (t: (key: string) => string) => [
  { label: `${t(text.under)} 30m²`, value: `0-30` },
  { label: `30-50m²`, value: `30-50` },
  { label: `50-80m²`, value: `50-80` },
  { label: `80-100m²`, value: `80-100` },
  { label: `100-150m²`, value: `100-150` },
  { label: `150-200m²`, value: `150-200` },
  { label: `200-250m²`, value: `200-250` },
  { label: `250-300m²`, value: `250-300` },
  { label: `300-500m²`, value: `300-500` },
  { label: `500-800m²`, value: `500-800` },
  { label: `trên 800m²`, value: `800-1000` },
];

export const getBedRoomData = (t: (key: string) => string) => [
  { label: `1`, value: `1` },
  { label: `2`, value: `2` },
  { label: `3`, value: `3` },
  { label: `4`, value: `4` },
  { label: `5+`, value: `5` },
];

export const getSortData = (t: (key: string) => string) => [
  { label: t(text.price_asc), value: `price` },
  { label: t(text.price_des), value: `price desc` },
  { label: t(text.area_asc), value: `area` },
  { label: t(text.area_desc), value: `area desc` },
  { label: t(text.created), value: `createdAt` },
  { label: t(text.created_desc), value: `createdAt desc` },
];
// src/screens/Home/utils/houseType_data.ts

export const HOUSE_TYPE_CATEGORY_MAP: Record<string, number> = {
  apartment: 1,
  mini_apartment: 2,
  house: 3,
  villa: 4,
  roadhouse: 5,
  shophouse: 6,
  projectLand: 7,
  land: 8,
  farm: 9,
  condotel: 10,
  warehouse: 11,
  other: 12,
};
