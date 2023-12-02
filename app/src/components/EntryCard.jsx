import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {ADDRESS} from '../core/api';

const EntryCard = ({message}) => {
  const profileImageSource = message.profile_image
    ? {uri: `http://${ADDRESS}${message.profile_image}`}
    : require('../assets/profile.png');
  console.log(profileImageSource);
  return (
    <View style={styles.container}>
      <Image source={profileImageSource} style={styles.image} />
      <Text style={styles.text}>{message.message}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
export default EntryCard;
