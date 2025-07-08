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
import { Colors } from '../../utils/color';
import { Spacing } from '../../utils/spacing';

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
      <ImageBackground
        source={IMAGES.logo}
        style={styles.splash}
      ></ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  splash: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
