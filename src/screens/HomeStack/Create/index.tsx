import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import AppStyles from '../../../components/AppStyle';
import { ICONS, text } from '../../../utils/constants';
import { useTranslation } from 'react-i18next';
import AppButton from '../../../components/AppButton';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { Spacing } from '../../../utils/spacing';
import { Colors } from '../../../utils/color';
import { Fonts } from '../../../utils/fontSize';
import { SearchBar } from 'react-native-screens';
import SearchModal from '../../../components/Modal/SearchModal';
import SearchLocationModal from '../../../components/Modal/SearchLocationModal';
import PropertyTypeModal from '../../../components/Modal/PropertyTypeModal';
import AppInput from '../../../components/AppInput';
import UnitSelectionModal from '../../../components/Modal/UnitModal';

interface Props {
  navigation: any;
}
const CreateScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [isShowDemand, setIsShowDemand] = useState(true);
  const [isShowMainInfo, setIsShowMainInfo] = useState(true);

  const [demandValue, setDemanValue] = useState(`${t(text.more_info)}`);
  const unitOptions = ['VND', 'USD', 'LAK']; // Available options for unit

  const [searchLocationModalVisible, setSearchLocationModalVisible] =
    useState(false);
  const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
  const [isUnitModalVisible, setUnitModalVisible] = useState(false);

  const [locationText, setLocationText] = useState(''); // NEW: hiển thị địa điểm
  const [propertyType, setPropertyType] = useState<any>(null);
  const [area, setArea] = useState('');
  const [price, setPrice] = useState<number>();
  const [unit, setUnit] = useState<{ label: string; value: string }>({
    label: 'VND',
    value: '1',
  });

  const handleSearchLocation = (location: any) => {
    const parts = [
      location?.ward?.name,
      location?.district?.name,
      location?.province?.name,
    ].filter(Boolean); // lọc null/undefined
    setLocationText(parts.join(', ')); // Ví dụ: "Phường Bến Nghé, Quận 1, TP.HCM"
  };
  const handleCancel = () => {
    setDemanValue(`${t(text.more_info)}`);
    setLocationText('');
    navigation.goBack();
  };
  const formatPriceToTy = (price: number): string => {
    if (!price || isNaN(price)) return '0 đồng';

    if (price >= 1_000_000_000) {
      const billion = price / 1_000_000_000;
      return billion % 1 === 0
        ? `${billion.toFixed(0)} ${t(text.bilion)}` // Hiển thị số nguyên nếu chia hết
        : `${billion.toFixed(2)} ${t(text.bilion)}`; // Hiển thị 2 chữ số thập phân nếu không chia hết
    }

    if (price >= 1_000_000) {
      const million = price / 1_000_000;
      return million % 1 === 0
        ? `${million.toFixed(0)} ${t(text.milion)}`
        : `${million.toFixed(2)} ${t(text.milion)}`;
    }

    if (price >= 1_000) {
      const thousand = price / 1_000;
      return thousand % 1 === 0
        ? `${thousand.toFixed(0)} ${t(text.thousand)}`
        : `${thousand.toFixed(2)} ${t(text.thousand)}`;
    }
    return `${price.toFixed(0)} ${t(text.coin)}`; // Trả về giá trị nếu không thuộc các loại trên
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header_top}>
          <Text style={[AppStyles.title, { marginBottom: 0 }]}>
            {t(text.create_post)}
          </Text>
          <TouchableOpacity
            onPress={() => handleCancel()}
            style={styles.button}
          >
            <Text style={styles.text}>{t(text.exit)}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={AppStyles.text}>{`${t(text.step)} 1: ${t(
            text.property_info,
          )}`}</Text>
          <View style={styles.processLine}>
            <View style={[styles.line, { borderColor: Colors.red }]} />
            <View style={styles.line} />
            <View style={styles.line} />
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.body_item}>
          <View style={styles.body_itemHeader}>
            <Text
              style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
            >
              {t(text.demand)}
            </Text>
            <TouchableOpacity onPress={() => setIsShowDemand(!isShowDemand)}>
              <Image
                source={isShowDemand ? ICONS.down : ICONS.up}
                style={AppStyles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.body_itemHeader}>
            {isShowDemand ? (
              <>
                <TouchableOpacity
                  onPress={() => setDemanValue(`${t(text.sale)}`)}
                  style={[
                    styles.body_itemButton,
                    {
                      borderWidth: demandValue === `${t(text.sale)}` ? 2 : 0.5,
                    },
                  ]}
                >
                  <Image
                    source={
                      demandValue === `${t(text.sale)}`
                        ? ICONS.tag_focus
                        : ICONS.tag
                    }
                    style={[AppStyles.icon, { marginVertical: Spacing.medium }]}
                  />
                  <Text
                    style={[AppStyles.text, { marginVertical: Spacing.medium }]}
                  >
                    {t(text.sale)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDemanValue(`${t(text.rent)}`)}
                  style={[
                    styles.body_itemButton,
                    {
                      borderWidth: demandValue === `${t(text.rent)}` ? 2 : 0.5,
                    },
                  ]}
                >
                  <Image
                    source={
                      demandValue === `${t(text.rent)}`
                        ? ICONS.key_focus
                        : ICONS.key
                    }
                    style={[AppStyles.icon, { marginVertical: Spacing.medium }]}
                  />
                  <Text
                    style={[AppStyles.text, { marginVertical: Spacing.medium }]}
                  >
                    {t(text.rent)}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setIsShowDemand(!isShowDemand)}>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecorationLine:
                        demandValue === `${t(text.sale)}` ||
                        demandValue === `${t(text.rent)}`
                          ? 'none'
                          : 'underline',
                    },
                  ]}
                >
                  {demandValue}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {demandValue === `${t(text.sale)}` ||
        demandValue === `${t(text.rent)}` ? (
          <View style={styles.body_item}>
            <View style={styles.body_itemHeader}>
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.prop_location)}
              </Text>
              <TouchableOpacity onPress={() => setIsShowDemand(!isShowDemand)}>
                <Image
                  source={isShowDemand ? ICONS.down : ICONS.up}
                  style={AppStyles.icon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.body_itemHeader}>
              {!locationText ? (
                <TouchableOpacity
                  onPress={() => setSearchLocationModalVisible(true)}
                  style={styles.searchBox}
                >
                  <Image
                    source={ICONS.search}
                    style={[AppStyles.icon, { marginRight: Spacing.medium }]}
                  />
                  <Text style={AppStyles.text}>{t(text.enter_location)}</Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.text}>{locationText}</Text>
                  <TouchableOpacity
                    onPress={() => setSearchLocationModalVisible(true)}
                    style={{ paddingHorizontal: Spacing.medium }}
                  >
                    <Image source={ICONS.edit} style={AppStyles.icon} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) : (
          <></>
        )}

        {/* {isShowMainInfo ? ( */}
        <View style={styles.body_item}>
          <View style={styles.body_itemHeader}>
            <Text
              style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
            >
              {t(text.main_info)}
            </Text>
            <TouchableOpacity
              onPress={() => setIsShowMainInfo(!isShowMainInfo)}
            >
              <Image
                source={isShowMainInfo ? ICONS.down : ICONS.up}
                style={AppStyles.icon}
              />
            </TouchableOpacity>
          </View>
          {isShowMainInfo ? (
            <View style={styles.body_itemBody}>
              <View>
                <Text
                  style={[
                    AppStyles.text_bold,
                    { marginBottom: Spacing.medium },
                  ]}
                >
                  {t(text.property_type)}
                </Text>
                <TouchableOpacity
                  onPress={() => setPropertyTypeVisible(true)}
                  style={styles.searchBox}
                >
                  <Text style={[AppStyles.text, { color: '#666666' }]}>
                    {propertyType?.label || t(text.property_type)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={[
                    AppStyles.text_bold,
                    { marginBottom: Spacing.medium },
                  ]}
                >
                  {t(text.acreage)}
                </Text>
                <View style={[styles.searchBox, { paddingVertical: 0 }]}>
                  <TextInput
                    style={[styles.text, { flex: 1 }]}
                    value={area}
                    keyboardType="number-pad"
                    onChangeText={text => setArea(text)}
                    placeholder={t(text.enter_area)}
                  />
                  <Text
                    style={
                      (AppStyles.text,
                      {
                        backgroundColor: Colors.lightGray,
                        padding: 5,
                        borderRadius: 10,
                      })
                    }
                  >
                    m²
                  </Text>
                  {area.length > 0 && (
                    <TouchableOpacity onPress={() => setArea('')}>
                      <Image
                        source={ICONS.clear}
                        style={[AppStyles.icon, { marginLeft: Spacing.small }]}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.body_itemHeader}>
                <View style={{ flex: 0.55 }}>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.price)}
                  </Text>
                  <View style={[styles.searchBox, { paddingVertical: 0 }]}>
                    <TextInput
                      style={[styles.text, { flex: 1 }]}
                      value={price}
                      keyboardType="number-pad"
                      onChangeText={text => setPrice(text)}
                      placeholder={t(text.enter_price)}
                    />

                    {area.length > 0 && (
                      <TouchableOpacity onPress={() => setArea('')}>
                        <Image
                          source={ICONS.clear}
                          style={[
                            AppStyles.icon,
                            { marginLeft: Spacing.small },
                          ]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={{ flex: 0.45, marginLeft: Spacing.small }}>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.unit)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setUnitModalVisible(true)}
                    style={[styles.searchBox, { height: 48 }]}
                  >
                    <Text style={[styles.text, { flex: 1, color: '#666666' }]}>
                      {unit.label || t(text.enter_unit)}
                    </Text>

                    <Image
                      source={ICONS.down}
                      style={[AppStyles.icon, { marginLeft: Spacing.small }]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <>
              {price && propertyType && area && unit ? (
                <Text style={styles.text}>{`${
                  propertyType.label
                } • ${formatPriceToTy(price)} • ${area}m²`}</Text>
              ) : (
                <TouchableOpacity onPress={() => setIsShowMainInfo(true)}>
                  <Text>{t(text.more_info)}</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
      <SearchLocationModal
        visible={searchLocationModalVisible}
        onClose={() => setSearchLocationModalVisible(false)}
        onSearch={handleSearchLocation}
      />
      <PropertyTypeModal
        visible={propertyTypeVisible}
        onClose={() => setPropertyTypeVisible(false)}
        onSelect={val => setPropertyType(val)}
        selectedValue={propertyType}
      />
      <UnitSelectionModal
        visible={isUnitModalVisible}
        onClose={() => setUnitModalVisible(false)} // Close modal
        onSelect={selectedUnit => {
          console.log('Selected Unit:', selectedUnit); // { label: 'VND', value: '1' }
          setUnit(selectedUnit); // Lưu giá trị đã chọn vào state hoặc xử lý theo cách bạn cần
        }}
        selectedValue={unit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.3,
    paddingTop: 70,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  header_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  processLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.small,
  },
  line: {
    borderColor: Colors.Gray,
    borderWidth: 3,
    borderRadius: 100,
    marginBottom: Spacing.small,
    width: '33%',
  },
  body: {
    flex: 2,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.medium,
  },
  body_item: {
    padding: Spacing.medium,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: Spacing.medium,
  },
  body_itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  body_itemButton: {
    marginTop: Spacing.medium,
    borderWidth: 0.5,
    paddingHorizontal: Spacing.medium,
    width: '48%',
    borderRadius: 20,
  },
  body_itemBody: {},
  button: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.small,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: '100%',
    borderRadius: 30,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderColor: Colors.Gray,
    borderWidth: 1,
  },
  text: { color: Colors.black, fontSize: Fonts.normal },
});

export default CreateScreen;
