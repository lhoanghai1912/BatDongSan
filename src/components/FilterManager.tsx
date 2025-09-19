// src/components/FilterManager.tsx - Component filter manager mới đơn giản

import React from 'react';
import CheckBoxModal from './Modal/CheckBoxModal';
import RadioButtonModal from './Modal/RadioButtonModal';
import { text } from '../utils/constants';
import { useTranslation } from 'react-i18next';

// Kiểu dữ liệu cho modal type
type FilterModalType = 'checkBoxModal' | 'radioButtonModal';

// Props interface
interface FilterManagerProps {
  visible: boolean;
  type: FilterModalType;
  title: string;
  data: any[];
  selected: string[] | string;
  onClose: () => void;
  onReset: () => void;
  onApplyFilter: (value: string[] | string) => void;
  isSingleValue?: boolean;
}

// Component chính
const FilterManager: React.FC<FilterManagerProps> = ({
  visible,
  type,
  title,
  data,
  selected,
  onClose,
  onReset,
  onApplyFilter,
  isSingleValue = false,
}) => {
  const { t } = useTranslation();

  // Luôn render component, chỉ ẩn/hiện bằng visible prop

  // Render CheckBoxModal cho property type
  if (type === 'checkBoxModal') {
    return (
      <CheckBoxModal
        visible={visible}
        title={title}
        data={data.map(item => ({
          ...item,
          value: item.value ?? item.label,
        }))}
        selected={selected as string[]}
        onClose={onClose}
        onReset={onReset}
        onSubmit={onApplyFilter}
      />
    );
  }

  // Render RadioButtonModal cho các filter khác
  if (type === 'radioButtonModal') {
    return (
      <RadioButtonModal
        visible={visible}
        title={title}
        data={data as { label: string; value: string }[]}
        selected={selected as string}
        onClose={onClose}
        onReset={onReset}
        isSingleValue={isSingleValue}
        onSubmit={onApplyFilter}
      />
    );
  }

  // Fallback - không render gì
  return null;
};

export default FilterManager;
