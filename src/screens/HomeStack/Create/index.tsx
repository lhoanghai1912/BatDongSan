import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
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

const CreateScreen = () => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header_top}>
          <Text style={[AppStyles.title, { marginBottom: 0 }]}>
            {t(text.create_post)}
          </Text>
          <TouchableOpacity style={styles.button}>
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
            <Text style={AppStyles.text}>{t(text.demand)}</Text>
            <TouchableOpacity onPress={() => setIsShow(!isShow)}>
              <Image
                source={isShow ? ICONS.down : ICONS.up}
                style={AppStyles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.body_itemHeader}>
            <View style={styles.body_itemButton}>
              <Image source={ICONS.tag} style={AppStyles.icon} />
              <Text>{t(text.sale)}</Text>
            </View>
            <View style={styles.body_itemButton}>
              <Image source={ICONS.key} style={AppStyles.icon} />
              <Text>{t(text.rent)}</Text>
            </View>
          </View>
        </View>
      </View>
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
  },
  body_itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  body_itemButton: { borderWidth: 0.5, padding: Spacing.small, width: '49%' },
  button: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.small,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 20,
  },
  text: { color: Colors.black, fontSize: Fonts.normal, fontWeight: 600 },
});

export default CreateScreen;
