import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
}

const Error: FC<Props> = ({ message }) => (
  <View style={[styles.container]}>
    <Text>Something went wrong</Text>
    <Text>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Error;
