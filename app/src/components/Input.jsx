import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

function Input({title, textType = 'none', secureTextEntry = false, keyboardType='default'}) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        style={styles.textInput}
        textContentType={textType}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#70747a',
    paddingLeft: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#e1e2e4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
  },
});
export default Input;
