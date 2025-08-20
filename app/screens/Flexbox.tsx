import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function FlexGridExample() {
  return (
    <View style={styles.container}>
      <View style={styles.box}><Text>1</Text></View>
      <View style={styles.box}><Text>2</Text></View>
      <View style={styles.box}><Text>3</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',  // horizontal layout
    justifyContent: 'space-between', // spacing
    padding: 10,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
});
