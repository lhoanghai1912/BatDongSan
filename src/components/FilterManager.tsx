import React from 'react';
import CheckBoxModal from './Modal/CheckBoxModal';
import RadioButtonModal from './Modal/RadioButtonModal';
import { text } from '../utils/constants';
import { useTranslation } from 'react-i18next';

// Kiểu dữ liệu input
type FilterModalType = 'checkBoxModal' | 'radioButtonModal';

interface FilterManagerProps {
  visible: boolean;
  type: FilterModalType;
  title: string;
  data: any[]; // string[] cho checkbox, button — { label, value }[] cho radio
  selected: string[] | string;
  onClose: () => void;
  onReset: () => void;
  onApplyFilter: (value: string[] | string) => void;
  isSingleValue?: boolean; // 👈 THÊM DÒNG NÀY
}
const FilterManager: React.FC<FilterManagerProps> = ({
  visible,
  type,
  title,
  data,
  selected,
  onClose,
  onReset,
  onApplyFilter,
  isSingleValue,
}) => {
  const { t } = useTranslation();
  // console.log(
  //   'filtermanger',
  //   title.toLowerCase().includes(`${t(text.bedrooms)}`),
  // );
  console.log('filtermanger', title.toLocaleLowerCase());
  console.log('include', t(text.bedrooms).toLocaleLowerCase());

  if (!visible) return null;

  // console.log("FilterMng" + );

  if (type === 'checkBoxModal') {
    return (
      <CheckBoxModal
        visible={visible}
        title={title}
        data={(data as any[]).map(item => ({
          ...item,
          value: item.value ?? item.label, // fallback to label if value is missing
        }))}
        selected={selected as string[]}
        onClose={onClose}
        onReset={onReset}
        onSubmit={onApplyFilter}
      />
    );
  }

  if (type === 'radioButtonModal') {
    return (
      <RadioButtonModal
        visible={visible}
        title={title}
        data={data as { label: string; value: string }[]}
        selected={selected as string}
        onClose={onClose}
        onReset={onReset}
        isSingleValue={title
          .toLowerCase()
          .includes(`${t(text.bedrooms).toLocaleLowerCase()}`)} // ✅ chỉ true với "Số phòng ngủ" à đây r :) có khi ở đây
        onSubmit={onApplyFilter}
      />
    );
  }

  return null;
};

export default FilterManager;
