import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

export default function Button({title}) {
  return (
    <View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202020',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
