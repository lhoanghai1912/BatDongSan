import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AppStyles from '../../../components/AppStyle';
import { ICONS, text } from '../../../utils/constants';
import { useTranslation } from 'react-i18next';
import AppButton from '../../../components/AppButton';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { Spacing } from '../../../utils/spacing';
import { Colors } from '../../../utils/color';
import SearchLocationModal from '../../../components/Modal/SearchLocationModal';
import PropertyTypeModal from '../../../components/Modal/PropertyTypeModal';
import UnitSelectionModal from '../../../components/Modal/UnitModal';
import styles from './style';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { createPost } from '../../../service';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any;
}
const CreateScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { userData: reduxUserData } = useSelector((state: any) => state.user);

  const [userData, setUserData] = useState(reduxUserData || null);
  const [isShowDemand, setIsShowDemand] = useState(true);
  const [isShowMainInfo, setIsShowMainInfo] = useState(true);
  const [isShowOtherInfo, setIsShowOtherInfo] = useState(true);
  const [isShowTitDes, setIshowTitDes] = useState(true);
  const [isShowImageUpload, setIsShowImagesUpdaload] = useState(true);
  const [loading, setLoading] = useState(false);

  const [demandLabel, setDemanLabel] = useState(`${t(text.more_info)}`);
  const [imageUris, setImageUris] = useState<string[]>([]); // State để lưu các URI của ảnh đã chọn

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
  const [location, setLocation] = useState<any>({});
  const [locationText, setLocationText] = useState(''); // NEW: hiển thị địa điểm
  const [propertyType, setPropertyType] = useState<any>('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState<{ label: string; value: number }>({
    label: 'VND',
    value: 0,
  });
  const [bedrooms, setBedroom] = useState(0);
  const [bathrooms, setBathroom] = useState(0);
  const [floor, setFloor] = useState(0);
  const [accessRoad, setAccessRoad] = useState(0);
  const [frontage, setFrontage] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [legal, setLegal] = useState<{ label: string; value: number }>({
    label: '',
    value: 0,
  });
  const [furniture, setFurniture] = useState<{ label: string; value: number }>({
    label: '',
    value: 0,
  });
  const [housedirection, setHouseDirection] = useState<{
    label: string;
    value: number;
  }>({
    label: '',
    value: 0,
  });
  const [balconydirection, setBalconyDirection] = useState<{
    label: string;
    value: number;
  }>({
    label: '',
    value: 0,
  });
  const [availableFrom, setAvailbleFrom] = useState<{
    label: string;
    value: number;
  }>({
    label: '',
    value: 0,
  });
  const [electricityPrice, seteElectricityPrice] = useState<{
    label: string;
    value: number;
  }>({
    label: '',
    value: 0,
  });
  const [waterPrice, setWaterPrice] = useState<{
    label: string;
    value: number;
  }>({
    label: '',
    value: 0,
  });
  const [internetPrice, setInternetPrice] = useState<{
    label: string;
    value: number;
  }>({
    label: '',
    value: 0,
  });
  const [contactName, setContactName] = useState(userData?.fullName);
  const [contactEmail, setContactEmail] = useState(userData?.email);
  const [contactPhone, setContactPhone] = useState(userData?.phoneNumber);
  const [imageUpload, setImageUpload] = useState<any[]>([]);
  console.log(userData);

  const handleSelect = (selected: { label: string; value: number }) => {
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
    setLocation(location);
    const parts = [
      location?.street,
      location?.commune?.name || '',
      location?.district?.name,
      location?.province?.name,
    ].filter(Boolean); // lọc null/undefined
    setLocationText(parts.join(', ')); // Ví dụ: "Phường Bến Nghé, Quận 1, TP.HCM"
  };

  useFocusEffect(
    React.useCallback(() => {
      // Reset toàn bộ các trường về rỗng
      setDemanLabel(`${t(text.more_info)}`);
      setLocation({});
      setLocationText('');
      setPropertyType('');
      setArea('');
      setPrice(0);
      setUnit({ label: 'VND', value: 0 });
      setBedroom(0);
      setBathroom(0);
      setFloor(0);
      setAccessRoad(0);
      setFrontage(0);
      setTitle('');
      setDescription('');
      setLegal({ label: '', value: 0 });
      setFurniture({ label: '', value: 0 });
      setHouseDirection({ label: '', value: 0 });
      setBalconyDirection({ label: '', value: 0 });
      setAvailbleFrom({ label: '', value: 0 });
      seteElectricityPrice({ label: '', value: 0 });
      setWaterPrice({ label: '', value: 0 });
      setInternetPrice({ label: '', value: 0 });
      setImageUpload([]);
      setImageUris([]);
      setIsShowDemand(true);
      setIsShowMainInfo(true);
      setIsShowOtherInfo(true);
      setIshowTitDes(true);
      setIsShowImagesUpdaload(true);

      return () => {
        // Cleanup nếu cần
      };
    }, []),
  );

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
    if (field === 'bedrooms') {
      setBedroom(bedrooms + 1);
    } else if (field === 'bathrooms') {
      setBathroom(bathrooms + 1);
    } else if (field === 'floor') {
      setFloor(floor + 1);
    }
  };

  const handleDecrease = (field: string) => {
    if (field === 'bedrooms' && bedrooms >= 1) {
      setBedroom(bedrooms - 1);
    } else if (field === 'bathrooms' && bathrooms >= 1) {
      setBathroom(bathrooms - 1);
    } else if (field === 'floor' && floor >= 1) {
      setFloor(floor - 1);
    }
  };

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser); // Store user data
        setContactEmail(parsedUser.email);
        setContactName(parsedUser.fullName);
        setContactPhone(parsedUser.phone);
      } else {
        // If no data in AsyncStorage, use Redux data
        setUserData(reduxUserData);
      }
    } catch (error) {
      console.log('Error fetching user data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [reduxUserData]);
  // Danh sách các trường có giá trị
  const otherInfo = [
    { label: t(text.legal), value: legal },
    { label: t(text.furnishing), value: furniture },
    { label: t(text.bedrooms), value: bedrooms },
    { label: t(text.bathrooms), value: bathrooms },
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
  const formData = new FormData();
  const data = {
    type,
    categoryType: propertyType.value,
    provinceId: location?.province?.id,
    provinceName: location?.province?.name,
    districtId: location?.district?.id,
    districtName: location?.district?.name,
    communeId: location?.commune?.id,
    communeName: location?.commune?.name,
    street: location?.street,
    area,
    price,
    unit: unit.value,
    legalDocument: legal.value,
    furniture: furniture.value,
    bedrooms,
    bathrooms,
    floor,
    houseDirection: housedirection.value,
    balconyDirection: balconydirection.value,
    accessRoad,
    frontage,
    availableFrom: availableFrom.value,
    electricityPrice: electricityPrice.value,
    waterPrice: waterPrice.value,
    internetPrice: internetPrice.value,
    title,
    description,
    menities: '1',
    contactName,
    contactPhone,
    contactEmail,
    videoUrl: 'http://youtu.be/xyz',
    isExpired: false,
    images: imageUpload.map((item: any, index: number) => {
      return {
        description: item?.fileName,
        displayOrder: index,
      };
    }),
  };
  imageUpload.forEach((item: any) => {
    formData.append('images', {
      uri: item?.uri,
      type: item?.type,
      name: item?.fileName,
    } as any);
  });

  formData.append('jsonPostData', JSON.stringify(data));

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await createPost(formData);
      console.log('ressssssss=================', res);

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Create post success',
        });
        navigate(Screen_Name.Home_Screen);
      }
    } catch (error) {
      console.log('Error is: ', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImagesFromLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 10,
      },
      response => {
        if (response.assets) {
          setImageUpload(response.assets);

          const newImageUris = response.assets
            .map(item => item.uri)
            .filter((uri): uri is string => typeof uri === 'string');
          // Lấy URI của ảnh đã chọn và loại bỏ undefined
          setImageUris(prevState => [...prevState, ...newImageUris]); // Thêm ảnh đã chọn vào mảng hiện tại
        }
      },
    );
  };

  // Hàm chụp ảnh mới
  const pickImageFromCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 1 }, response => {
      if (response.assets) {
        const uri = response.assets[0].uri;
        if (typeof uri === 'string') {
          setImageUris(prevState => [...prevState, uri]); // Thêm ảnh chụp vào mảng hiện tại
        }
      }
    });
  };

  // Xóa ảnh
  const removeImage = (uri: string) => {
    setImageUris(prevState => prevState.filter(item => item !== uri));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header_top}>
          <Text style={[AppStyles.title, { marginBottom: 0 }]}>
            {t(text.create_post)}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
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
        {loading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <ActivityIndicator size="large" color="#E53935" />
          </View>
        )}
        <View style={styles.body}>
          <View style={styles.body_item}>
            <TouchableOpacity
              style={styles.body_itemHeader}
              onPress={() => setIsShowDemand(!isShowDemand)}
            >
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.demand)}
              </Text>
              <Image
                source={isShowDemand ? ICONS.down : ICONS.up}
                style={AppStyles.icon}
              />
            </TouchableOpacity>
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
                  <TouchableOpacity
                    onPress={() => setSearchLocationModalVisible(true)}
                    style={{
                      paddingHorizontal: Spacing.medium,
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={[styles.text, { flexShrink: 1 }]}>
                      {locationText}
                    </Text>
                    <Image source={ICONS.edit} style={AppStyles.icon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <></>
          )}

          {/* Main info */}
          {locationText ? (
            <>
              <View style={styles.body_item}>
                <View style={styles.body_itemHeader}>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
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
                        <View
                          style={[styles.searchBox, { paddingVertical: 0 }]}
                        >
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
                            style={[
                              AppStyles.icon,
                              { marginLeft: Spacing.small },
                            ]}
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
                        <Text style={styles.text}>{t(text.more_info)}</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </>
          ) : (
            <></>
          )}

          <View style={styles.body_item}>
            <View style={styles.body_itemHeader}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    AppStyles.text_bold,
                    { marginBottom: Spacing.medium },
                  ]}
                >
                  {t(text.contact_info)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsShowImagesUpdaload(!isShowImageUpload)}
              >
                <Image
                  source={isShowImageUpload ? ICONS.down : ICONS.up}
                  style={AppStyles.icon}
                />
              </TouchableOpacity>
            </View>
            {/* fullname */}
            <View>
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.fullname)}
              </Text>
              <View style={[styles.searchBox, { paddingVertical: 0 }]}>
                <TextInput
                  style={[styles.text, { flex: 1 }]}
                  value={contactName}
                  keyboardType="number-pad"
                  onChangeText={text => setContactName(text)}
                  placeholder={t(text.fullname)}
                />
              </View>
            </View>
            {/* email */}
            <View>
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.email)}
              </Text>
              <View style={[styles.searchBox, { paddingVertical: 0 }]}>
                <TextInput
                  style={[styles.text, { flex: 1 }]}
                  value={contactEmail}
                  keyboardType="number-pad"
                  onChangeText={text => setContactEmail(text)}
                  placeholder={t(text.email)}
                />
              </View>
            </View>

            {/* phoneNumber */}
            <View>
              <Text
                style={[AppStyles.text_bold, { marginBottom: Spacing.medium }]}
              >
                {t(text.phone)}
              </Text>
              <View style={[styles.searchBox, { paddingVertical: 0 }]}>
                <TextInput
                  style={[styles.text, { flex: 1 }]}
                  value={contactPhone}
                  keyboardType="number-pad"
                  onChangeText={text => setContactPhone(text)}
                  placeholder={t(text.phone)}
                />
              </View>
            </View>
          </View>
          {/* Other Info */}
          {propertyType && area && price && unit ? (
            <>
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
                      source={isShowOtherInfo ? ICONS.down : ICONS.up}
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
                          setSelectedField('furniture'),
                            setUnitModalVisible(true);
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
                        <Text style={AppStyles.text_bold}>
                          {t(text.bedrooms)}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            disabled={bedrooms === 0}
                            onPress={() => handleDecrease('bedrooms')}
                          >
                            <Image
                              source={ICONS.minus}
                              style={[
                                AppStyles.icon,
                                {
                                  tintColor:
                                    bedrooms === 0
                                      ? Colors.Gray
                                      : Colors.darkGray,
                                },
                              ]}
                            />
                          </TouchableOpacity>
                          <Text style={styles.quantity}>{bedrooms}</Text>
                          <TouchableOpacity
                            onPress={() => handleIncrease('bedrooms')}
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
                        <Text style={AppStyles.text_bold}>
                          {t(text.bathrooms)}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            disabled={bathrooms === 0}
                            onPress={() => handleDecrease('bathrooms')}
                          >
                            <Image
                              source={ICONS.minus}
                              style={[
                                AppStyles.icon,
                                {
                                  tintColor:
                                    bathrooms === 0
                                      ? Colors.Gray
                                      : Colors.darkGray,
                                },
                              ]}
                            />
                          </TouchableOpacity>
                          <Text style={styles.quantity}>{bathrooms}</Text>
                          <TouchableOpacity
                            onPress={() => handleIncrease('bathrooms')}
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
                        <Text style={AppStyles.text_bold}>
                          {t(text.floors)}
                        </Text>
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
                          <TouchableOpacity
                            onPress={() => handleIncrease('floor')}
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
                          {housedirection.label ||
                            t(text.modal.balconyDirection)}
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
                          {balconydirection.label ||
                            t(text.modal.balconyDirection)}
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
                            accessRoad !== undefined
                              ? accessRoad.toString()
                              : ''
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
                          value={
                            frontage !== undefined ? frontage.toString() : ''
                          }
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
                            <Text
                              style={[AppStyles.text, { color: '#666666' }]}
                            >
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
                            <Text
                              style={[AppStyles.text, { color: '#666666' }]}
                            >
                              {electricityPrice.label ||
                                t(text.electricityPrice)}
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
                            <Text
                              style={[AppStyles.text, { color: '#666666' }]}
                            >
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
                            <Text
                              style={[AppStyles.text, { color: '#666666' }]}
                            >
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
                      <TouchableOpacity
                        onPress={() => setIsShowOtherInfo(true)}
                      >
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
                  </View>
                  <TouchableOpacity
                    onPress={() => setIshowTitDes(!isShowTitDes)}
                  >
                    <Image
                      source={isShowTitDes ? ICONS.down : ICONS.up}
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
                      <Text style={AppStyles.text_bold}>
                        {t(text.description)}
                      </Text>
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
            </>
          ) : (
            <></>
          )}

          {/* Image Upload */}
          {title && description ? (
            <>
              <View style={styles.body_item}>
                <View style={styles.body_itemHeader}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        AppStyles.text_bold,
                        { marginBottom: Spacing.medium },
                      ]}
                    >
                      {t(text.upload_image)}
                    </Text>
                    <Text
                      style={[AppStyles.text, { marginLeft: Spacing.medium }]}
                    >{`(${t(text.optional)})`}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsShowImagesUpdaload(!isShowImageUpload)}
                  >
                    <Image
                      source={isShowImageUpload ? ICONS.down : ICONS.up}
                      style={AppStyles.icon}
                    />
                  </TouchableOpacity>
                </View>
                {isShowImageUpload ? (
                  <>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                      }}
                    >
                      <ScrollView
                        contentContainerStyle={{ marginBottom: Spacing.medium }}
                      >
                        <View
                          style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                        >
                          {imageUris.map((uri, index) => {
                            const uniqueKey = `image-${index}-${uri}`; // Tạo key duy nhất cho mỗi phần tử

                            if (index === 0) {
                              // Ảnh đầu tiên sẽ chiếm hết chiều rộng
                              return (
                                <>
                                  <Image
                                    key={uniqueKey}
                                    source={{ uri }}
                                    style={{
                                      width: '100%',
                                      height: 200,
                                      marginBottom: 10,
                                    }}
                                  />
                                  <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => removeImage(uri)}
                                  >
                                    <Image
                                      source={ICONS.clear}
                                      style={styles.clearImageIcon}
                                    />
                                  </TouchableOpacity>
                                </>
                              );
                            } else {
                              // Các ảnh sau sẽ chia thành 2 cột
                              return (
                                <View
                                  key={index}
                                  style={{ width: '50%', padding: 5 }}
                                >
                                  <Image
                                    source={{ uri }}
                                    style={{ width: '100%', height: 100 }}
                                  />
                                  <TouchableOpacity
                                    style={[
                                      styles.removeImageButton,
                                      { top: 5, right: 5 },
                                    ]}
                                    onPress={() => removeImage(uri)}
                                  >
                                    <Image
                                      source={ICONS.clear}
                                      style={styles.clearImageIcon}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            }
                          })}
                        </View>
                      </ScrollView>

                      <TouchableOpacity
                        style={[
                          AppStyles.button,
                          {
                            marginBottom: Spacing.medium,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          },
                        ]}
                        onPress={pickImagesFromLibrary}
                      >
                        <Image
                          source={ICONS.image}
                          style={[
                            AppStyles.icon,
                            {
                              marginHorizontal: Spacing.medium,
                              tintColor: Colors.white,
                            },
                          ]}
                        />
                        <Text style={[styles.text, { color: Colors.white }]}>
                          Chọn ảnh từ thư viện
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          AppStyles.button,
                          {
                            marginBottom: Spacing.medium,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          },
                        ]}
                        onPress={pickImageFromCamera}
                      >
                        <Image
                          source={ICONS.plus}
                          style={[
                            AppStyles.icon,
                            {
                              marginHorizontal: Spacing.medium,
                              tintColor: Colors.white,
                            },
                          ]}
                        />
                        <Text style={[styles.text, { color: Colors.white }]}>
                          Chụp ảnh mới
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    {imageUris.length > 0 ? (
                      <>
                        <TouchableOpacity
                          onPress={() => setIsShowImagesUpdaload(true)}
                        >
                          <Text
                            style={[
                              styles.text,
                              { textDecorationLine: 'underline' },
                            ]}
                          >{` ${
                            (t(text.selected), imageUris.length, t(text.image))
                          }`}</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() => setIsShowImagesUpdaload(true)}
                        >
                          <Text
                            style={[
                              styles.text,
                              { textDecorationLine: 'underline' },
                            ]}
                          >
                            Chọn ảnh
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}
              </View>
            </>
          ) : (
            <></>
          )}
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

export default CreateScreen;
