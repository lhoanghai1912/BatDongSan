import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { text } from '../../../utils/constants';
import { Spacing } from '../../../utils/spacing';
import AppStyles from '../../../components/AppStyle';
import { listLikedPost, getPostById } from '../../../service';
import ImageCard from '../ImageCard';
import { Colors } from '../../../utils/color';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PostType = {
  _id: string;
  [key: string]: any;
};

const HeartScreen = () => {
  const { t } = useTranslation();
  const [listDataLiked, setListLiked] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { token } = useSelector((state: any) => state.user);

  const getPost = async () => {
    try {
      setRefreshing(true);

      if (token) {
        const res = await listLikedPost();
        setListLiked(res || []);
      } else {
        const stored = await AsyncStorage.getItem('savedLikes');
        const likedIds = stored ? JSON.parse(stored) : [];

        const promises = likedIds.map((id: number) => getPostById(id));
        const posts = await Promise.all(promises);

        setListLiked(posts.filter(Boolean)); // loại bỏ null
      }
    } catch (error) {
      console.log('Get Post Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const onRefresh = useCallback(() => {
    getPost();
  }, []);

  const renderPost = ({ item }: { item: PostType }) => {
    return (
      <>
        <ImageCard post={item} onReload={getPost} />
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
          }
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
