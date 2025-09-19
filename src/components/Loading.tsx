import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/color';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Spacing } from '../utils/spacing';
import { Fonts } from '../utils/fontSize';

type LoadingProps = {
  isLoading: boolean;
};
const LoadingScreen: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
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
