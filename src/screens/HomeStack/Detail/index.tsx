import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import AppStyles from '../../../components/AppStyle';

const { width } = Dimensions.get('window');

const DetailScreen = ({ route }) => {
  const { post } = route.params; // mảng các URL ảnh
  console.log('route', route);
  console.log('data', post);

  console.log(
    'imagessssssssssssssssssssssssssssssssssssssss',
    post.images.map(item => item.link),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={post.images.map(item => item.link)}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <>
            <View style={{ flex: 1, height: 300, backgroundColor: 'red' }}>
              <Image
                source={{ uri: item }}
                style={[styles.image, { flex: 1 }]}
              />
            </View>
          </>
        )}
      />
      <Text style={AppStyles.text}>abc</Text>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  image: {
    width,
    height: 300,
    resizeMode: 'contain',
  },
});
