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

  console.log('imagessssssssssssssssssssssssssssssssssssssss', post);

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={images}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      /> */}
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
