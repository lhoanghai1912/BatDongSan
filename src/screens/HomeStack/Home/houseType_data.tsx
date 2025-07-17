import { useTransition } from 'react';
import { ICONS, text } from '../../../utils/constants';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
export const houseTypeData = (t: any) => [
  { icon: ICONS.apartment, label: t(text.modal.houseType.apartment) },
  {
    icon: ICONS.mini_apartment,
    label: t(text.modal.houseType.mini_apartment),
  },
  { icon: ICONS.house, label: t(text.modal.houseType.house) },
  { icon: ICONS.villa, label: t(text.modal.houseType.villa) },
  { icon: ICONS.roadhouse, label: t(text.modal.houseType.roadhouse) },
  { icon: ICONS.shophouse, label: t(text.modal.houseType.shophouse) },
  {
    icon: ICONS.projectLand,
    label: t(text.modal.houseType.projectLand),
  },
  { icon: ICONS.land, label: t(text.modal.houseType.land) },
  { icon: ICONS.farm, label: t(text.modal.houseType.farm) },
  { icon: ICONS.condotel, label: t(text.modal.houseType.condotel) },
  { icon: ICONS.warehouse, label: t(text.modal.houseType.warehouse) },
  { icon: ICONS.other, label: t(text.modal.houseType.other) },
];
