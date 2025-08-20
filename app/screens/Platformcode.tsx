import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

export default function PlatformCode() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {Platform.OS === 'ios'
          ? 'This is iOS'
          : Platform.OS === 'android'
          ? 'This is Android'
          : 'This is Web'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      Platform.OS === 'ios'
        ? '#e0f7fa'
        : Platform.OS === 'android'
        ? '#fff3e0'
        : '#f3e5f5',
  },
  text: {
    fontSize: 20,
    color:
      Platform.OS === 'ios'
        ? 'blue'
        : Platform.OS === 'android'
        ? 'green'
        : 'purple',
    fontWeight: 'bold',
  },
});
