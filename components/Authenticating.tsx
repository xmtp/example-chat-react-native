import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const Authenticating = () => (
  <View style={[styles.container]}>
    <ActivityIndicator size="large" />
    <Text style={[styles.text]}>Waiting for signature...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
  },
});

export default Authenticating;
