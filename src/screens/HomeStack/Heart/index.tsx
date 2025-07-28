import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { text } from '../../../utils/constants';
import { Spacing } from '../../../utils/spacing';
import AppStyles from '../../../components/AppStyle';
import { listLikedPost } from '../../../service';
import ImageCard from '../ImageCard';
import { Colors } from '../../../utils/color';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

type PostType = {
  _id: string;
  // add other properties as needed
  [key: string]: any;
};

const HeartScreen = () => {
  const { t } = useTranslation();
  const [listDataLiked, setListLiked] = useState([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { token } = useSelector((state: any) => state.user);

  const getPost = async () => {
    const res = await listLikedPost();
    console.log('list Liked: ', res);
    setListLiked(res);
  };
  useFocusEffect(
    React.useCallback(() => {
      getPost(); // gọi lại API khi màn hình được focus
    }, [token]),
  );
  const onRefresh = useCallback(() => {
    getPost();
  }, []);

  const renderPost = ({ item }: { item: PostType }) => {
    const key = item._id ? item._id.toString() : `${Math.random()}`; // Đảm bảo key hợp lệ

    return (
      <>
        <ImageCard post={item} key={key} />
        <View style={styles.underLine} />
      </>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            AppStyles.title,
            {
              textAlign: 'left',
              marginBottom: Spacing.medium,
              paddingHorizontal: Spacing.medium,
            },
          ]}
        >
          {t(text.saved_post)}
        </Text>
        <View style={AppStyles.line} />
      </View>
      <View style={styles.body}>
        <FlatList
          data={listDataLiked}
          ListEmptyComponent={
            <Text style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}>
              Chưa lưu bài viết nào
            </Text>
          }
          keyExtractor={item =>
            item._id ? item._id.toString() : `${Math.random()}`
          } // Sử dụng key ngẫu nhiên nếu _id không có
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderPost}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  header: {},
  body: { marginBottom: Spacing.xxxlarge },
  underLine: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    marginVertical: Spacing.medium,
    width: '100%',
  },
});

export default HeartScreen;
