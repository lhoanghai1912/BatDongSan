import React, { use, useCallback, useEffect, useState } from 'react';
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
import { ICONS, link, text } from '../../../utils/constants';
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
import i18n from '../../../i18n/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  navigation: any;
  route?: any;
}
const CreateScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { userData: reduxUserData } = useSelector((state: any) => state.user);
  const insets = useSafeAreaInsets();
  // ✅ Extract edit mode data from route params
  const editPost = route?.params?.post;
  const isEditMode = !!editPost; // ✅ Auto-detect edit mode
  const editingPostId = editPost?.id;

  console.log('Edit Mode:', isEditMode);
  console.log('Edit Post Data:', editPost);

  const [userData, setUserData] = useState(reduxUserData || null);
  const [isShowDemand, setIsShowDemand] = useState(true);
  const [isShowMainInfo, setIsShowMainInfo] = useState(true);
  const [isShowContactInfo, setIsShowContactInfo] = useState(true);
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
    | 'currency'
    | 'unit'
    | 'legal'
    | 'furniture'
    | 'housedirection'
    | 'balconydirection'
    | 'availableFrom'
    | 'electricityPrice'
    | 'waterPrice'
    | 'internetPrice'
  >('currency');
  const type =
    demandLabel === t(text.sale) ? 1 : demandLabel === t(text.rent) ? 2 : '';
  const [location, setLocation] = useState<any>({});
  const [locationText, setLocationText] = useState(''); // NEW: hiển thị địa điểm
  const [propertyType, setPropertyType] = useState<any>('');
  const [area, setArea] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<{ label: string; value: number }>({
    label: t(text.currency_label),
    value: 1,
  });
  const [unit, setUnit] = useState<{ label: string; value: number }>({
    label: 'USD',
    value: 1,
  });
  const [bedrooms, setBedroom] = useState(0);
  const [bathrooms, setBathroom] = useState(0);
  const [floors, setFloor] = useState(0);
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
  console.log('currency', currency, 'unit', unit);

  const handleSelect = (selected: { label: string; value: number }) => {
    switch (selectedField) {
      case 'currency':
        setCurrency(selected);
        break;
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

  // ✅ Auto-fill form with edit data
  useEffect(() => {
    if (isEditMode && editPost) {
      console.log('Auto-filling form with edit data:', editPost);

      // ✅ Fill basic info
      setDemanLabel(editPost.type === 1 ? t(text.sale) : t(text.rent));
      setTitle(editPost.title || '');
      setDescription(editPost.description || '');
      setArea(editPost.area?.toString() || '');
      setPrice(editPost.price || 0);
      setBedroom(editPost.bedrooms || 0);
      setBathroom(editPost.bathrooms || 0);
      setFloor(editPost.floors || 0);
      setAccessRoad(editPost.accessRoad || 0);
      setFrontage(editPost.frontage || 0);

      // ✅ Fill contact info
      setContactName(editPost.contactName || userData?.fullName || '');
      setContactEmail(editPost.contactEmail || userData?.email || '');
      setContactPhone(editPost.contactPhone || userData?.phoneNumber || '');

      // ✅ Fill location data
      if (editPost.provinceId) {
        const locationData = {
          province: {
            id: editPost.provinceId,
            name: editPost.provinceName,
          },
          district: {
            id: editPost.districtId,
            name: editPost.districtName,
          },
          commune: {
            id: editPost.communeId,
            name: editPost.communeName,
          },
          street: editPost.street || '',
        };
        setLocation(locationData);

        // ✅ Build location text
        const parts = [
          editPost.street,
          editPost.communeName,
          editPost.districtName,
          editPost.provinceName,
        ].filter(Boolean);
        setLocationText(parts.join(', '));
      }

      // ✅ Fill property type
      if (editPost.categoryType) {
        setPropertyType({
          value: editPost.categoryType,
          label: editPost.categoryTypeText || '',
        });
      }

      // ✅ Fill currency info
      if (editPost.currency) {
        setCurrency({
          value: editPost.currency,
          label: editPost.currencyText || t(text.currency_label),
        });
      }

      if (editPost.unit) {
        setUnit({
          value: editPost.unit,
          label: editPost.unitText || t(text.unit_label),
        });
      }

      // ✅ Fill complex fields (if available in post data)
      if (editPost.legalDocument) {
        setLegal({
          value: editPost.legalDocument,
          label: editPost.legalDocumentText || '',
        });
      }

      if (editPost.furniture) {
        setFurniture({
          value: editPost.furniture,
          label: editPost.furnitureText || '',
        });
      }

      if (editPost.houseDirection) {
        setHouseDirection({
          value: editPost.houseDirection,
          label: editPost.houseDirectionText || '',
        });
      }

      if (editPost.balconyDirection) {
        setBalconyDirection({
          value: editPost.balconyDirection,
          label: editPost.balconyDirectionText || '',
        });
      }

      // ✅ Fill rental-specific fields
      if (editPost.type === 2) {
        // Rent
        if (editPost.availableFrom) {
          setAvailbleFrom({
            value: editPost.availableFrom,
            label: editPost.availableFromText || '',
          });
        }

        if (editPost.electricityPrice) {
          seteElectricityPrice({
            value: editPost.electricityPrice,
            label: editPost.electricityPriceText || '',
          });
        }

        if (editPost.waterPrice) {
          setWaterPrice({
            value: editPost.waterPrice,
            label: editPost.waterPriceText || '',
          });
        }

        if (editPost.internetPrice) {
          setInternetPrice({
            value: editPost.internetPrice,
            label: editPost.internetPriceText || '',
          });
        }
      }

      // ✅ Fill existing images
      if (editPost.images && editPost.images.length > 0) {
        const existingImageUris = editPost.images.map(
          (img: any) => `${link.url}${img.imageUrl || img.url}`,
        );
        setImageUris(existingImageUris);

        // ✅ Set imageUpload for form submission (existing images)
        const existingImageData = editPost.images.map(
          (img: any, index: number) => ({
            uri: `${link.url}${img.imageUrl || img.url}`,
            fileName: img.description || `image_${index}`,
            type: 'image/jpeg',
            isExisting: true, // ✅ Flag for existing images
            id: img.id,
          }),
        );
        setImageUpload(existingImageData);
      }

      console.log('Form auto-filled successfully for edit mode');
    }
  }, [isEditMode, editPost, userData, t]);

  // ✅ Modify useFocusEffect to only reset for new posts
  useFocusEffect(
    React.useCallback(() => {
      // ✅ Only reset form if NOT in edit mode
      if (!isEditMode) {
        console.log('Resetting form for new post creation');
        // Reset toàn bộ các trường về rỗng
        setDemanLabel(`${t(text.more_info)}`);
        setLocation({});
        setLocationText('');
        setPropertyType('');
        setArea(0);
        setPrice(0);
        setCurrency({
          label: 'USD',
          value: 1,
        });
        setUnit({ label: t(text.unit_label), value: 1 });
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
        setIsShowContactInfo(true);
        setIsShowOtherInfo(true);
        setIshowTitDes(true);
        setIsShowImagesUpdaload(true);
      }

      return () => {
        // Cleanup nếu cần
      };
    }, [isEditMode, t]),
  );
  console.log('rou', route);

  const formatPriceToTy = (price: number): string => {
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
    } else if (field === 'floors') {
      setFloor(floors + 1);
    }
  };

  const handleDecrease = (field: string) => {
    if (field === 'bedrooms' && bedrooms >= 1) {
      setBedroom(bedrooms - 1);
    } else if (field === 'bathrooms' && bathrooms >= 1) {
      setBathroom(bathrooms - 1);
    } else if (field === 'floors' && floors >= 1) {
      setFloor(floors - 1);
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
        setContactPhone(parsedUser.phoneNumber);
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
    { label: t(text.floors), value: floors },
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

  // ✅ Modify handleCreatePost to handle both create and update
  const handleCreatePost = async () => {
    setLoading(true);
    try {
      // ✅ Prepare form data (same as before)
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
        currency: currency.value,
        unit: unit.value,
        legalDocument: legal.value,
        furnishing: furniture.value,
        bedrooms,
        bathrooms,
        floors,
        houseOrientation: housedirection.value,
        balconyDirection: balconydirection.value,
        acccessRoad: accessRoad,
        frontage,
        availableFrom: availableFrom.value,
        electricityPrice: electricityPrice.value,
        waterPrice: waterPrice.value,
        internetPrice: internetPrice.value,
        title,
        description,
        menities: 1,
        contactName,
        contactPhone,
        contactEmail,
        videoUrl: 'http://youtu.be/xyz',
        isExpired: false,
        images: imageUpload.map((item: any, index: number) => {
          return {
            description: item?.fileName,
            displayOrder: index,
            ...(item.isExisting && { id: item.id }), // ✅ Include ID for existing images
          };
        }),
      };

      // ✅ Handle image uploads (only new images)
      const newImages = imageUpload.filter(item => !item.isExisting);
      newImages.forEach((item: any) => {
        formData.append('images', {
          uri: item?.uri,
          type: item?.type,
          name: item?.fileName,
        } as any);
      });

      formData.append('jsonPostData', JSON.stringify(data));

      let res;
      if (isEditMode) {
        // ✅ Update existing post
        console.log('Updating post:', editingPostId);
        // res = await updatePost(editingPostId, formData); // ✅ You'll need to create this API function
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Post updated successfully',
        });
      } else {
        // ✅ Create new post
        console.log('Creating new post', formData);
        res = await createPost(formData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Post created successfully',
        });
      }

      console.log('Operation result:', res);

      if (res.status === 200) {
        navigate(Screen_Name.Post_Screen); // ✅ Navigate back to posts list
      }
    } catch (error) {
      console.log('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: isEditMode ? 'Failed to update post' : 'Failed to create post',
      });
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
  console.log('picked iamge', imageUris);

  // ✅ Update header title based on mode
  const headerTitle = isEditMode ? t('Edit Post') : t(text.create_post);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.header_top}>
          <Text style={[AppStyles.title, { marginBottom: 0 }]}>
            {headerTitle}
          </Text>
          <TouchableOpacity
            onPress={() =>
              editPost ? navigate(Screen_Name.Post_Screen) : navigation.goBack()
            }
            style={styles.button}
          >
            <Text style={styles.text}>{t(text.exit)}</Text>
          </TouchableOpacity>
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
                        <Text style={[AppStyles.text]}>
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
                          value={area.toLocaleString('vi-VN')}
                          keyboardType="number-pad"
                          onChangeText={textChange => {
                            const raw = textChange.replace(/\./g, '');
                            const num = Number(raw);
                            setArea(isNaN(num) ? 0 : num);
                          }}
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
                        {area > 0 && (
                          <TouchableOpacity onPress={() => setArea(0)}>
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
                    <View>
                      <Text
                        style={[
                          AppStyles.text_bold,
                          { marginBottom: Spacing.medium },
                        ]}
                      >
                        {t(text.price)}
                      </Text>
                      <View
                        style={[
                          styles.searchBox,
                          {
                            paddingVertical: 0,
                            backgroundColor:
                              unit.label === t(text.deal)
                                ? Colors.Gray
                                : undefined,
                          },
                        ]}
                      >
                        <TextInput
                          // style={[styles.text, { flex: 1 }]}
                          value={
                            unit.label === t(text.deal)
                              ? '0'
                              : price
                              ? price.toLocaleString('vi-VN')
                              : ''
                          }
                          keyboardType="number-pad"
                          editable={unit.label !== t(text.deal)}
                          style={[
                            styles.text,
                            {
                              flex: 1,
                            },
                          ]}
                          onChangeText={textChange => {
                            if (unit.label === t(text.deal)) {
                              setPrice(0);
                              return;
                            }
                            const raw = textChange.replace(/\./g, '');
                            const num = Number(raw);
                            setPrice(isNaN(num) ? 0 : num);
                          }}
                          placeholder={t(text.enter_price)}
                        />

                        {area > 0 && (
                          <TouchableOpacity onPress={() => setPrice(0)}>
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
                      <View style={{ flex: 0.4 }}>
                        <Text
                          style={[
                            AppStyles.text_bold,
                            { marginBottom: Spacing.medium },
                          ]}
                        >
                          {t(text.currency)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedField('currency'),
                              setUnitModalVisible(true);
                          }}
                          style={[styles.searchBox, { height: 48 }]}
                        >
                          <Text
                            style={[styles.text, { flex: 1, color: '#666666' }]}
                          >
                            {currency.label || t(text.enter_currency)}
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
                      <View style={{ flex: 0.6, marginLeft: Spacing.small }}>
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
                    <Text style={AppStyles.text}>
                      {unit.value == 1 && price
                        ? `${t(text.value)}: ${formatPriceToTy(price)} ${
                            currency.label
                          }`
                        : unit.value == 2 && price
                        ? `${formatPriceToTy(price)} ${currency.label}/m²\n${t(
                            text.total_value,
                          )}: ${formatPriceToTy(price * Number(area))} ${
                            currency.label
                          }`
                        : null}
                    </Text>
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

          {/* Contact Information */}
          {propertyType &&
          area &&
          unit &&
          ((price && price > 0) || unit.label === t(text.deal)) ? (
            <>
              <View style={styles.body_item}>
                <View style={styles.body_itemHeader}>
                  <Text
                    style={[
                      AppStyles.text_bold,
                      { marginBottom: Spacing.medium },
                    ]}
                  >
                    {t(text.contact_info)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsShowContactInfo(!isShowContactInfo)}
                  >
                    <Image
                      source={isShowContactInfo ? ICONS.down : ICONS.up}
                      style={AppStyles.icon}
                    />
                  </TouchableOpacity>
                </View>
                {isShowContactInfo ? (
                  <View style={styles.body_itemBody}>
                    {/* fullname */}
                    <View>
                      <Text
                        style={[
                          AppStyles.text_bold,
                          { marginBottom: Spacing.medium },
                        ]}
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
                        style={[
                          AppStyles.text_bold,
                          { marginBottom: Spacing.medium },
                        ]}
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
                        style={[
                          AppStyles.text_bold,
                          { marginBottom: Spacing.medium },
                        ]}
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
                ) : (
                  <>
                    {contactName && contactPhone && contactEmail ? (
                      <Text
                        style={styles.text}
                      >{`${contactName} • ${contactPhone} • ${contactEmail}`}</Text>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setIsShowContactInfo(true)}
                      >
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

          {/* Other Info */}
          {propertyType &&
          area &&
          unit &&
          ((price && price > 0) || unit.label === t(text.deal)) ? (
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
                            disabled={floors === 0}
                            onPress={() => handleDecrease('floors')}
                          >
                            <Image
                              source={ICONS.minus}
                              style={[
                                AppStyles.icon,
                                {
                                  tintColor:
                                    floors === 0
                                      ? Colors.Gray
                                      : Colors.darkGray,
                                },
                              ]}
                            />
                          </TouchableOpacity>
                          <Text style={styles.quantity}>{floors}</Text>
                          <TouchableOpacity
                            onPress={() => handleIncrease('floors')}
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
                      <View key={item.label || index} style={styles.item}>
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
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            width: '100%',
                          }}
                        >
                          {imageUris.map((uri, index) => {
                            const uniqueKey = `image-${uri}`;
                            if (imageUris.length === 1) {
                              // Nếu chỉ có 1 ảnh, hiển thị full width
                              return (
                                <View key={uniqueKey} style={{ width: '100%' }}>
                                  <Image
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
                                </View>
                              );
                            } else if (index === 0) {
                              // Ảnh đầu tiên khi có nhiều ảnh
                              return (
                                <View key={uniqueKey} style={{ width: '100%' }}>
                                  <Image
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
                                </View>
                              );
                            } else {
                              // Các ảnh sau chia 2 cột
                              return (
                                <View
                                  key={uniqueKey}
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
                          {t(text.upload_image)}
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
                          {t(text.create_image)}
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
          title={isEditMode ? t('Update Post') : t(text.create_post)}
          customStyle={[{ display: imageUpload.length > 0 ? 'flex' : 'none' }]}
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
          selectedField === 'currency'
            ? currency
            : selectedField === 'unit'
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
