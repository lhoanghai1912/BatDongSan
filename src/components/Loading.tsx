import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/color';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Spacing } from '../utils/spacing';
import { Fonts } from '../utils/fontSize';
const LoadingScreen = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: Spacing.small,
    fontSize: Fonts.normal,
    color: '#000',
  },
});

export default LoadingScreen;
