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
import { text } from '../../../utils/constants';
import { Spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';
import { Colors } from '../../../utils/color';

const PAGE_SIZE = 10;

const PostScreen: React.FC = () => {
  const flatListRef = useRef<FlatList<PostType>>(null);

  const [loading, setLoading] = useState(false); // overlay khi load lần đầu / focus
  const [refreshing, setRefreshing] = useState(false); // kéo để làm mới
  const [loadingMore, setLoadingMore] = useState(false); // load trang kế tiếp
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { t } = useTranslation();

  // Gọi API chung: dùng cho 3 case (initial/focus, refresh, loadMore)
  // Gọi API chung: dùng cho 3 case (initial/focus, refresh, loadMore)
  const fetchPosts = useCallback(
    async ({
      nextPage = 1,
      replace = false, // true = thay list (initial/refresh), false = append (load more)
      showOverlay = false,
    }: {
      nextPage?: number;
      replace?: boolean;
      showOverlay?: boolean;
    }) => {
      try {
        if (showOverlay) setLoading(true);
        console.log('nextPage', nextPage, 'pageSize', PAGE_SIZE);

        const res = await getPostOfUser(nextPage, PAGE_SIZE);
        console.log('res', res);

        const list: PostType[] = res?.result ?? [];

        // ✅ Calculate new posts array BEFORE setting state
        const newPosts = replace ? list : [...posts, ...list];
        setPosts(newPosts);
        setPage(nextPage);

        // ✅ FIX: Use direct API response structure
        if (res?.total != null) {
          const total = res.total as number;
          console.log('Pagination calc:', {
            newPostsLength: newPosts.length,
            total,
            hasMore: newPosts.length < total,
          });
          setHasMore(newPosts.length < total);
        } else {
          // ✅ FIX: Correct fallback logic
          const hasMoreData = list.length === PAGE_SIZE;
          console.log('Fallback hasMore:', {
            listLength: list.length,
            PAGE_SIZE,
            hasMore: hasMoreData,
          });
          setHasMore(hasMoreData);
        }
      } catch (err) {
        console.log('fetchPosts error:', err);
        setHasMore(false); // ✅ Stop pagination on error
      } finally {
        if (showOverlay) setLoading(false);
      }
    },
    [posts], // ✅ FIX: Use posts array, not posts.length
  );

  // ✅ FIX: Prevent infinite loop in useFocusEffect
  const loadInitialData = useCallback(() => {
    fetchPosts({ nextPage: 1, replace: true, showOverlay: true });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadInitialData();
      return () => {};
    }, [loadInitialData]),
  );

  // ✅ FIX: Reset hasMore and page on refresh
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setHasMore(true); // ✅ Reset hasMore
      setPage(1); // ✅ Reset page
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      await fetchPosts({ nextPage: 1, replace: true, showOverlay: false });
    } catch (err) {
      console.log('refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPosts]);
  // Chạm đáy để load thêm
  const handleLoadMore = useCallback(async () => {
    console.log('handleLoadMore triggered:', {
      loadingMore,
      loading,
      refreshing,
      hasMore,
      currentPage: page,
    });

    if (loadingMore || loading || refreshing || !hasMore) {
      console.log('Load more skipped due to conditions');
      return;
    }

    try {
      setLoadingMore(true);
      console.log('Loading page:', page + 1);

      await fetchPosts({
        nextPage: page + 1,
        replace: false,
        showOverlay: false,
      });
    } catch (err) {
      console.log('loadMore error:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, refreshing, hasMore, fetchPosts, page]);

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
    // ✅ Show loading indicator when loading more
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" />
          <Text style={AppStyles.text}>{'Loading more...'}</Text>
        </View>
      );
    }

    // ✅ Show "no more data" when reached end
    if (posts.length > 0 && !hasMore) {
      return (
        <View style={styles.footerNoMore}>
          <Text style={AppStyles.text}>{t('No more posts')}</Text>
        </View>
      );
    }

    // ✅ No footer for other states
    return null;
  }, [loadingMore, hasMore, posts.length, t]);
  return (
    <View style={styles.container}>
      <NavBar title={t(text.uploaded)} />
      <View
        style={{
          // borderWidth: 1,
          borderRadius: 20,
          backgroundColor: Colors.white,
          marginHorizontal: Spacing.medium,
          marginTop: Spacing.small, // Re-enable marginTop
          // flex: 1,
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
        />
      </View>
      <LoadingScreen isLoading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
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
