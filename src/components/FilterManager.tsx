import React from 'react';
import CheckBoxModal from './Modal/CheckBoxModal';
import RadioButtonModal from './Modal/RadioButtonModal';

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
  if (!visible) return null;

  if (type === 'checkBoxModal') {
    return (
      <CheckBoxModal
        visible={visible}
        title={title}
        data={data as string[]}
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
        isSingleValue={title.toLowerCase().includes('phòng ngủ')} // ✅ chỉ true với "Số phòng ngủ"
        onSubmit={onApplyFilter}
      />
    );
  }

  return null;
};

export default FilterManager;
