import React from 'react';
import {Text, StyleSheet} from 'react-native';

const Title = ({text, color}) => {
  return <Text style={[styles.titleText, {color}]}>{text}</Text>;
};

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 60,
    fontFamily: 'Montserrat-Bold',
    
  },
});

export default Title;
