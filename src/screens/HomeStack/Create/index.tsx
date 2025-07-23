import React, { use, useState } from 'react';
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
  const [isShowMainInfo, setIsShowMainInfo] = useState(false);
  const [isShowOtherInfo, setIsShowOtherInfo] = useState(false);
  const [isShowTitDes, setIshowTitDes] = useState(false);
  const [demandLabel, setDemanLabel] = useState(`${t(text.more_info)}`);

  const [searchLocationModalVisible, setSearchLocationModalVisible] =
    useState(false);
  const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
  const [isUnitModalVisible, setUnitModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<
    | 'unit'
    | 'legal'
    | 'furniture'
    | 'housedirection'
    | 'balconydirection'
    | 'availableFrom'
    | 'electricityPrice'
    | 'waterPrice'
    | 'internetPrice'
  >('unit');

  const type =
    demandLabel === t(text.sale) ? 1 : demandLabel === t(text.rent) ? 2 : '';
  const [provinceId, setProvinceId] = useState();
  const [districtId, setDistrictId] = useState();
  const [communeId, setCommuneId] = useState();
  const [provinceName, setProvinceName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [communeName, setCommuneName] = useState('');
  const [location, setLocation] = useState<any>({});
  const [locationText, setLocationText] = useState(''); // NEW: hiển thị địa điểm
  const [propertyType, setPropertyType] = useState<any>('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState(0);
  const [unit, setUnit] = useState<{ label: string; value: string }>({
    label: 'VND',
    value: '1',
  });
  const [bedroom, setBedroom] = useState(0);
  const [bathroom, setBathroom] = useState(0);
  const [floor, setFloor] = useState(0);
  const [accessRoad, setAccessRoad] = useState(0);
  const [frontage, setFrontage] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [legal, setLegal] = useState<{ label: string; value: string }>({
    label: '',
    value: '',
  });
  const [furniture, setFurniture] = useState<{ label: string; value: string }>({
    label: '',
    value: '',
  });
  const [housedirection, setHouseDirection] = useState<{
    label: string;
    value: string;
  }>({
    label: '',
    value: '',
  });
  const [balconydirection, setBalconyDirection] = useState<{
    label: string;
    value: string;
  }>({
    label: '',
    value: '',
  });

  const [availableFrom, setAvailbleFrom] = useState<{
    label: string;
    value: string;
  }>({
    label: '',
    value: '',
  });
  const [electricityPrice, seteElectricityPrice] = useState<{
    label: string;
    value: string;
  }>({
    label: '',
    value: '',
  });
  const [waterPrice, setWaterPrice] = useState<{
    label: string;
    value: string;
  }>({
    label: '',
    value: '',
  });
  const [internetPrice, setInternetPrice] = useState<{
    label: string;
    value: string;
  }>({
    label: '',
    value: '',
  });
  const handleSelect = (selected: { label: string; value: string }) => {
    switch (selectedField) {
      case 'unit':
        setUnit(selected);
        break;
      case 'legal':
        setLegal(selected);
        break;
      case 'furniture':
        setFurniture(selected);
        break;
      case 'housedirection':
        setHouseDirection(selected);
        break;
      case 'balconydirection':
        setBalconyDirection(selected);
        break;
      case 'availableFrom':
        setAvailbleFrom(selected);
        break;
      case 'electricityPrice':
        seteElectricityPrice(selected);
        break;
      case 'waterPrice':
        setWaterPrice(selected);
        break;
      case 'internetPrice':
        setInternetPrice(selected);
        break;
      default:
        break;
    }
  };

  const handleSearchLocation = (location: any) => {
    console.log('abc', location);

    setLocation(location);
    const parts = [
      location?.commune?.name || '',
      location?.district?.name,
      location?.province?.name,
    ].filter(Boolean); // lọc null/undefined
    setLocationText(parts.join(', ')); // Ví dụ: "Phường Bến Nghé, Quận 1, TP.HCM"
  };
  const handleCancel = () => {
    // Reset các giá trị nhập liệu
    setDemanLabel(`${t(text.more_info)}`);
    setLocationText('');
    setPropertyType('');
    setArea('');
    setPrice(0);
    setUnit({ label: 'VND', value: '1' });
    setBedroom(0);
    setBathroom(0);
    setFloor(0);
    setAccessRoad(0);
    setFrontage(0);
    setLegal({ label: '', value: '' });
    setFurniture({ label: '', value: '' });
    setHouseDirection({ label: '', value: '' });
    setBalconyDirection({ label: '', value: '' });
    setAvailbleFrom({ label: '', value: '' });
    seteElectricityPrice({ label: '', value: '' });
    setWaterPrice({ label: '', value: '' });
    setInternetPrice({ label: '', value: '' });

    // Đóng tất cả các modal nếu có
    setSearchLocationModalVisible(false);
    setPropertyTypeVisible(false);
    setUnitModalVisible(false);

    // Quay lại màn hình trước
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
  const handleIncrease = (field: string) => {
    if (field === 'bedroom') {
      setBedroom(bedroom + 1);
    } else if (field === 'bathroom') {
      setBathroom(bathroom + 1);
    } else if (field === 'floor') {
      setFloor(floor + 1);
    }
  };

  const handleDecrease = (field: string) => {
    if (field === 'bedroom' && bedroom >= 1) {
      setBedroom(bedroom - 1);
    } else if (field === 'bathroom' && bathroom >= 1) {
      setBathroom(bathroom - 1);
    } else if (field === 'floor' && floor >= 1) {
      setFloor(floor - 1);
    }
  };

  // Danh sách các trường có giá trị
  const otherInfo = [
    { label: t(text.legal), value: legal },
    { label: t(text.furnishing), value: furniture },
    { label: t(text.bedrooms), value: bedroom },
    { label: t(text.bathrooms), value: bathroom },
    { label: t(text.floors), value: floor },
    { label: t(text.modal.houseDirection), value: housedirection },
    { label: t(text.modal.balconyDirection), value: balconydirection },
    { label: t(text.accessRoad), value: accessRoad },
    { label: t(text.frontage), value: frontage },
    { label: t(text.availableFrom), value: availableFrom },
    { label: t(text.electricityPrice), value: electricityPrice },
    { label: t(text.waterPrice), value: waterPrice },
    { label: t(text.internetPrice), value: internetPrice },
    // Thêm các trường khác vào đây nếu cần
  ];

  // Lọc ra các phần tử có giá trị hợp lệ
  const validOtherInfo = otherInfo.filter(item => {
    // Kiểm tra trường hợp giá trị là object có thể chứa `label` (đối với các trường như legal, furniture...)
    if (typeof item.value === 'object' && item.value !== null) {
      return item.value.label && item.value.label !== ''; // Chỉ hiển thị nếu label có giá trị
    }

    // Kiểm tra các giá trị số hoặc chuỗi
    return (
      item.value !== null &&
      item.value !== undefined &&
      item.label !== '' &&
      item.value !== 0
    );
  });

  // Số lượng phần tử cần hiển thị khi thu gọn
  const maxVisibleItems = 3;

  // Các phần tử được hiển thị khi thu gọn
  const visibleItems = isShowOtherInfo
    ? validOtherInfo
    : validOtherInfo.slice(0, maxVisibleItems);
  const remainingCount = validOtherInfo.length - visibleItems.length; // Số lượng phần còn lại

  const handleCreatePost = () => {
    // Log tất cả các trường khi nhấn "Create Post"
    console.log('type', type);
    console.log('Category Type', propertyType.value);

    console.log('proviceId: ', location?.province?.id);
    console.log('proviceName: ', location?.province?.name);
    console.log('districId: ', location?.district?.id);
    console.log('districName: ', location?.district?.name);
    console.log('communeId: ', location?.commune?.id);
    console.log('communeName: ', location?.commune?.name);
    console.log('Area:', area);
    console.log('Price:', price);
    console.log('Unit:', unit.value);
    console.log('Furniture:', furniture);
    console.log('Bedroom:', bedroom);
    console.log('Bathroom:', bathroom);
    console.log('Floor:', floor);
    console.log('House Direction:', housedirection.value);
    console.log('Balcony Direction:', balconydirection.value);
    console.log('Access Road:', accessRoad);
    console.log('Frontage:', frontage);
    console.log('Legal:', legal.value);
    console.log('Available From:', availableFrom.value);
    console.log('Electricity Price:', electricityPrice.value);
    console.log('Water Price:', waterPrice.value);
    console.log('Internet Price:', internetPrice.value);
    console.log('Title:', title);
    console.log('Description:', description);

    // Add any further logic for post creation (e.g., API call) here
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
      <ScrollView>
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
                    onPress={() => setDemanLabel(`${t(text.sale)}`)}
                    style={[
                      styles.body_itemButton,
                      {
                        borderWidth:
                          demandLabel === `${t(text.sale)}` ? 2 : 0.5,
                      },
                    ]}
                  >
                    <Image
                      source={
                        demandLabel === `${t(text.sale)}`
                          ? ICONS.tag_focus
                          : ICONS.tag
                      }
                      style={[
                        AppStyles.icon,
                        { marginVertical: Spacing.medium },
                      ]}
                    />
                    <Text
                      style={[
                        AppStyles.text,
                        { marginVertical: Spacing.medium },
                      ]}
                    >
                      {t(text.sale)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setDemanLabel(`${t(text.rent)}`)}
                    style={[
                      styles.body_itemButton,
                      {
                        borderWidth:
                          demandLabel === `${t(text.rent)}` ? 2 : 0.5,
                      },
                    ]}
                  >
                    <Image
                      source={
                        demandLabel === `${t(text.rent)}`
                          ? ICONS.key_focus
                          : ICONS.key
                      }
                      style={[
                        AppStyles.icon,
                        { marginVertical: Spacing.medium },
                      ]}
                    />
                    <Text
                      style={[
                        AppStyles.text,
                        { marginVertical: Spacing.medium },
                      ]}
                    >
                      {t(text.rent)}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsShowDemand(!isShowDemand)}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        textDecorationLine:
                          demandLabel === `${t(text.sale)}` ||
                          demandLabel === `${t(text.rent)}`
                            ? 'none'
                            : 'underline',
                      },
                    ]}
                  >
                    {demandLabel}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {demandLabel === `${t(text.sale)}` ||
          demandLabel === `${t(text.rent)}` ? (
            <View style={styles.body_item}>
              <View style={styles.body_itemHeader}>
                <Text
                  style={[
                    AppStyles.text_bold,
                    { marginBottom: Spacing.medium },
                  ]}
                >
                  {t(text.prop_location)}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsShowDemand(!isShowDemand)}
                >
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

          {/* Main info */}
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
                          style={[
                            AppStyles.icon,
                            { marginLeft: Spacing.small },
                          ]}
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
                        value={price !== undefined ? price.toString() : ''}
                        keyboardType="number-pad"
                        onChangeText={text => setPrice(Number(text))}
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
                      onPress={() => {
                        setSelectedField('unit'), setUnitModalVisible(true);
                      }}
                      style={[styles.searchBox, { height: 48 }]}
                    >
                      <Text
                        style={[styles.text, { flex: 1, color: '#666666' }]}
                      >
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

          {/* Other Info */}
          <View style={styles.body_item}>
            <View style={styles.body_itemHeader}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    AppStyles.text_bold,
                    { marginBottom: Spacing.medium },
                  ]}
                >
                  {t(text.other_info)}
                </Text>
                <Text
                  style={[AppStyles.text, { marginLeft: Spacing.medium }]}
                >{`(${t(text.optional)})`}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsShowOtherInfo(!isShowOtherInfo)}
              >
                <Image
                  source={isShowMainInfo ? ICONS.down : ICONS.up}
                  style={AppStyles.icon}
                />
              </TouchableOpacity>
            </View>
            {isShowOtherInfo ? (
              <View style={styles.body_itemBody}>
                {/* Legal */}
                <View>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.legal)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField('legal'), setUnitModalVisible(true);
                    }}
                    style={styles.searchBox}
                  >
                    <Text style={[AppStyles.text, { color: '#666666' }]}>
                      {legal.label || t(text.legal)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Furnishing */}
                <View>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.furnishing)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField('furniture'), setUnitModalVisible(true);
                    }}
                    style={styles.searchBox}
                  >
                    <Text style={[AppStyles.text, { color: '#666666' }]}>
                      {furniture.label || t(text.furnishing)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Increase/Decrease Item */}
                <View>
                  {/* Bed */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: Spacing.medium,
                    }}
                  >
                    <Text style={AppStyles.text_bold}>{t(text.bedrooms)}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        disabled={bedroom === 0}
                        onPress={() => handleDecrease('bedroom')}
                      >
                        <Image
                          source={ICONS.minus}
                          style={[
                            AppStyles.icon,
                            {
                              tintColor:
                                bedroom === 0 ? Colors.Gray : Colors.darkGray,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{bedroom}</Text>
                      <TouchableOpacity
                        onPress={() => handleIncrease('bedroom')}
                      >
                        <Image
                          source={ICONS.plus}
                          style={[
                            AppStyles.icon,
                            { tintColor: Colors.darkGray },
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Bath */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: Spacing.medium,
                    }}
                  >
                    <Text style={AppStyles.text_bold}>{t(text.bathrooms)}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        disabled={bathroom === 0}
                        onPress={() => handleDecrease('bathroom')}
                      >
                        <Image
                          source={ICONS.minus}
                          style={[
                            AppStyles.icon,
                            {
                              tintColor:
                                bathroom === 0 ? Colors.Gray : Colors.darkGray,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{bathroom}</Text>
                      <TouchableOpacity
                        onPress={() => handleIncrease('bathroom')}
                      >
                        <Image
                          source={ICONS.plus}
                          style={[
                            AppStyles.icon,
                            { tintColor: Colors.darkGray },
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Floor */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: Spacing.medium,
                    }}
                  >
                    <Text style={AppStyles.text_bold}>{t(text.floors)}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        disabled={floor === 0}
                        onPress={() => handleDecrease('floor')}
                      >
                        <Image
                          source={ICONS.minus}
                          style={[
                            AppStyles.icon,
                            {
                              tintColor:
                                floor === 0 ? Colors.Gray : Colors.darkGray,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{floor}</Text>
                      <TouchableOpacity onPress={() => handleIncrease('floor')}>
                        <Image
                          source={ICONS.plus}
                          style={[
                            AppStyles.icon,
                            { tintColor: Colors.darkGray },
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* House Direction */}
                <View>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.modal.houseDirection)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField('housedirection'),
                        setUnitModalVisible(true);
                    }}
                    style={styles.searchBox}
                  >
                    <Text style={[AppStyles.text, { color: '#666666' }]}>
                      {housedirection.label || t(text.modal.balconyDirection)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Balcony Direction */}
                <View>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.modal.balconyDirection)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField('balconydirection'),
                        setUnitModalVisible(true);
                    }}
                    style={styles.searchBox}
                  >
                    <Text style={[AppStyles.text, { color: '#666666' }]}>
                      {balconydirection.label || t(text.modal.balconyDirection)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Access Road */}
                <View>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.accessRoad)}
                  </Text>
                  <View style={[styles.searchBox, { paddingVertical: 0 }]}>
                    <TextInput
                      style={[styles.text, { flex: 1 }]}
                      value={
                        accessRoad !== undefined ? accessRoad.toString() : ''
                      }
                      keyboardType="number-pad"
                      onChangeText={text => setAccessRoad(Number(text))}
                      placeholder={t(text.accessRoad)}
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
                      m
                    </Text>
                    {accessRoad > 0 && (
                      <TouchableOpacity onPress={() => setAccessRoad(0)}>
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

                {/* Frontage */}
                <View>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.frontage)}
                  </Text>
                  <View style={[styles.searchBox, { paddingVertical: 0 }]}>
                    <TextInput
                      style={[styles.text, { flex: 1 }]}
                      value={frontage !== undefined ? frontage.toString() : ''}
                      keyboardType="number-pad"
                      onChangeText={text => setFrontage(Number(text))}
                      placeholder={t(text.frontage)}
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
                      m
                    </Text>
                    {frontage > 0 && (
                      <TouchableOpacity onPress={() => setFrontage(0)}>
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

                {type === 2 ? (
                  <View>
                    {/* Available From */}
                    <View>
                      <Text
                        style={[
                          AppStyles.text_bold,
                          { marginBottom: Spacing.medium },
                        ]}
                      >
                        {t(text.availableFrom)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedField('availableFrom'),
                            setUnitModalVisible(true);
                        }}
                        style={styles.searchBox}
                      >
                        <Text style={[AppStyles.text, { color: '#666666' }]}>
                          {availableFrom.label || t(text.availableFrom)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Electricity Price */}
                    <View>
                      <Text
                        style={[
                          AppStyles.text_bold,
                          { marginBottom: Spacing.medium },
                        ]}
                      >
                        {t(text.electricityPrice)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedField('electricityPrice'),
                            setUnitModalVisible(true);
                        }}
                        style={styles.searchBox}
                      >
                        <Text style={[AppStyles.text, { color: '#666666' }]}>
                          {electricityPrice.label || t(text.electricityPrice)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Water Price */}
                    <View>
                      <Text
                        style={[
                          AppStyles.text_bold,
                          { marginBottom: Spacing.medium },
                        ]}
                      >
                        {t(text.waterPrice)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedField('waterPrice'),
                            setUnitModalVisible(true);
                        }}
                        style={styles.searchBox}
                      >
                        <Text style={[AppStyles.text, { color: '#666666' }]}>
                          {waterPrice.label || t(text.waterPrice)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Internet Price */}
                    <View>
                      <Text
                        style={[
                          AppStyles.text_bold,
                          { marginBottom: Spacing.medium },
                        ]}
                      >
                        {t(text.internetPrice)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedField('internetPrice'),
                            setUnitModalVisible(true);
                        }}
                        style={styles.searchBox}
                      >
                        <Text style={[AppStyles.text, { color: '#666666' }]}>
                          {internetPrice.label || t(text.internetPrice)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            ) : (
              <View style={styles.body_itemBody}>
                {/* Hiển thị các phần tử đầu tiên khi thu gọn */}
                {visibleItems.map((item, index) => (
                  <View key={index} style={styles.item}>
                    <Text style={styles.text}>{item.label}:</Text>
                    <Text style={styles.text}>
                      {typeof item.value === 'object' && item.value !== null
                        ? item.value.label
                        : item.value}
                    </Text>
                  </View>
                ))}
                {/* Hiển thị thông báo về số lượng còn lại nếu có */}
                {remainingCount > 0 && (
                  <TouchableOpacity onPress={() => setIsShowOtherInfo(true)}>
                    <Text style={AppStyles.text}>{`+ ${remainingCount} ${t(
                      text.more_info,
                    )}`}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Title and Descripton */}
          <View style={styles.body_item}>
            <View style={styles.body_itemHeader}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    AppStyles.text_bold,
                    { marginBottom: Spacing.medium },
                  ]}
                >
                  {t(text.title_des)}
                </Text>
                <Text
                  style={[AppStyles.text, { marginLeft: Spacing.medium }]}
                >{`(${t(text.optional)})`}</Text>
              </View>
              <TouchableOpacity onPress={() => setIshowTitDes(!isShowTitDes)}>
                <Image
                  source={isShowMainInfo ? ICONS.down : ICONS.up}
                  style={AppStyles.icon}
                />
              </TouchableOpacity>
            </View>
            {isShowTitDes ? (
              <View>
                {/* Title Input */}
                <View>
                  <Text style={AppStyles.text_bold}>{t(text.title)}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={text => setTitle(text)}
                    maxLength={99}
                  />
                </View>
                <View>
                  {/* Description input (with larger height when expanded) */}
                  <Text style={AppStyles.text_bold}>{t(text.description)}</Text>
                  <ScrollView style={styles.scrollViewContainer}>
                    <TextInput
                      style={[styles.input, styles.descriptionInput]}
                      placeholder="Enter Description"
                      value={description}
                      onChangeText={text => setDescription(text)}
                      multiline={true}
                      numberOfLines={5} // Tạo chiều cao lớn cho Description
                      maxLength={3000} // Giới hạn tối đa 3000 ký tự
                      scrollEnabled={true} // Cho phép cuộn khi nội dung dài
                    />
                  </ScrollView>
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
        <AppButton
          title={t(text.create_post)}
          onPress={() => handleCreatePost()}
        />
      </ScrollView>

      {/* Modal */}
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
        onSelect={handleSelect} // Use handleSelect to update state
        selectedValue={
          selectedField === 'unit'
            ? unit
            : selectedField === 'legal'
            ? legal
            : selectedField === 'furniture'
            ? furniture
            : selectedField === 'housedirection'
            ? housedirection
            : selectedField === 'balconydirection'
            ? balconydirection
            : selectedField === 'availableFrom'
            ? availableFrom
            : selectedField === 'electricityPrice'
            ? electricityPrice
            : selectedField === 'waterPrice'
            ? waterPrice
            : internetPrice
        }
        type={selectedField}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
    paddingBottom: Spacing.large,
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
    marginBottom: Spacing.medium,
    backgroundColor: Colors.white,
    borderColor: Colors.Gray,
    borderWidth: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.small,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingLeft: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  descriptionInput: {
    height: 120, // Chiều cao lớn cho description
    textAlignVertical: 'top', // Đảm bảo text bắt đầu từ trên
  },
  scrollViewContainer: {
    maxHeight: 200, // Giới hạn chiều cao của ScrollView nếu cần
  },
  quantity: {
    marginHorizontal: Spacing.medium,
    fontSize: Fonts.large,
    color: Colors.black,
  },
  text: { color: Colors.black, fontSize: Fonts.normal },
});

export default CreateScreen;
