import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native-paper';

import { getPostOfUser } from '../../../service';
import LoadingScreen from '../../../components/Loading';
import ImageCard from '../ImageCard';
import { PostType } from '../../../store/reducers/postSlice';
import AppStyles from '../../../components/AppStyle';
import NavBar from '../../../components/Navbar';
import { message, text } from '../../../utils/constants';
import { Spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';
import { Colors } from '../../../utils/color';

const PAGE_SIZE = 10;

const PostScreen = ({ navigation }: any) => {
  const flatListRef = useRef<FlatList<PostType>>(null);

  const [loading, setLoading] = useState(false); // overlay khi load lần đầu / focus
  const [refreshing, setRefreshing] = useState(false); // kéo để làm mới
  const [loadingMore, setLoadingMore] = useState(false); // load trang kế tiếp
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [noMoreData, setNoMoreData] = useState(false);

  const { t } = useTranslation();

  const fetchPosts = async (
    currentPage: number,
    isRefresh: boolean = false,
  ) => {
    if (loading || loadingMore) return;

    if (isRefresh) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      console.log('🚀 API Call - getPostOfUser:', {
        page: currentPage,
        pageSize: PAGE_SIZE,
        isRefresh,
      });

      const res = await getPostOfUser(currentPage, PAGE_SIZE);
      console.log('📥 API Response:', res);

      if (res?.result && Array.isArray(res.result)) {
        const newPosts = res.result as PostType[];

        if (newPosts.length === 0 || newPosts.length < PAGE_SIZE) {
          setNoMoreData(true);
        }

        setPosts(prevState => {
          if (isRefresh || currentPage === 1) {
            // Reset noMoreData khi refresh hoặc load page đầu
            setNoMoreData(newPosts.length < PAGE_SIZE);
            return newPosts;
          } else {
            // Loại bỏ post trùng id
            const existingIds = new Set(prevState.map(post => post.id));
            const filteredNewPosts = newPosts.filter(
              post => !existingIds.has(post.id),
            );
            const finalPosts = [...prevState, ...filteredNewPosts];
            console.log('📊 Posts appended:', {
              previous: prevState.length,
              new: filteredNewPosts.length,
              total: finalPosts.length,
            });
            return finalPosts;
          }
        });
      } else {
        if (isRefresh || currentPage === 1) {
          setPosts([]);
        }
        setNoMoreData(true);
      }
    } catch (error) {
      if (isRefresh || currentPage === 1) {
        setPosts([]);
      }
      setNoMoreData(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setNoMoreData(false);
      fetchPosts(1, true);
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setNoMoreData(false);
    fetchPosts(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && !noMoreData && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, false);
    } else {
    }
  };

  const renderPost = useCallback(
    ({ item }: { item: PostType }) => (
      <>
        <ImageCard post={item} edit={true} />
        <View
          style={[AppStyles.underLine, { paddingHorizontal: Spacing.medium }]}
        />
      </>
    ),
    [],
  );

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" />
          <Text style={AppStyles.text}>{t(message.loading_more)}</Text>
        </View>
      );
    }

    if (noMoreData && posts.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text style={AppStyles.text}>{t(message.no_more_posts)}</Text>
        </View>
      );
    }

    return null;
  }, [loadingMore, noMoreData, posts.length, t]);

  return (
    <View style={styles.container}>
      <NavBar
        title={t(text.uploaded)}
        onPress={() => navigation.goBack()}
        customStyle={[{ paddingHorizontal: Spacing.medium }]}
      />
      <View
        style={{
          borderRadius: 20,
          backgroundColor: Colors.white,
          marginHorizontal: Spacing.medium,
          marginTop: Spacing.small,
          maxHeight: `88%`,
        }}
      >
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderPost}
          style={{
            marginVertical: Spacing.medium,
          }}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            !loading ? (
              <Text style={[AppStyles.label, { textAlign: 'center' }]}>
                {t(text.no_data)}
              </Text>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          removeClippedSubviews
          maxToRenderPerBatch={8}
          windowSize={7}
          initialNumToRender={10}
          contentContainerStyle={
            posts.length === 0
              ? { flexGrow: 1, justifyContent: 'center' }
              : undefined
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
      <LoadingScreen isLoading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerLoader: {
    paddingVertical: Spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerNoMore: {
    paddingVertical: Spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PostScreen;
