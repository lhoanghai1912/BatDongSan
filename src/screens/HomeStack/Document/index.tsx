import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DocumentScreen = () => {
  return (
    <View style={styles.container}>
      <Text>DocumentScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DocumentScreen;
