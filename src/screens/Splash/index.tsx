import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ImageBackground,
} from 'react-native';

import { IMAGES } from '../../utils/constants';

const SplashScreen = ({ onAnimationEnd }: { onAnimationEnd: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // giữ splash 1.5s rồi fade-out trong 0.5s
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        onAnimationEnd();
      });
    }, 1500);
  }, []);
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: fadeAnim }] }]}
    >
      <Image source={IMAGES.logo} style={styles.splash}></Image>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splash: {
    resizeMode: 'contain',
    width: '100%', // điều chỉnh chiều rộng
    height: '100%',
  },
});

export default SplashScreen;
