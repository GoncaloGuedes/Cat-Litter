import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {ADDRESS} from '../core/api';
import {useNavigation} from '@react-navigation/native';
import {formatDate, formatTime} from '../core/utils';

const EntryCard = ({message}) => {
  const navigation = useNavigation();

  const profileImageSource = message.profile_image
    ? {uri: `http://${ADDRESS}${message.profile_image}`}
    : require('../assets/profile.png');

  const onPress = async () => {
    navigation.navigate('Details', {message}); // Pass the entire message object as a parameter
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={profileImageSource} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textName}>{message.user}</Text>
          <Text style={styles.textDate}>{formatDate(message)}</Text>
          <Text style={styles.textDate}>{formatTime(message)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    overflow: 'hidden',
  },
  imageContainer: {
    borderRightColor: 'gray',
    borderRightWidth: 1,
    paddingRight: 10,
    height: '100%',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  textName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textDate: {
    fontSize: 14,
    color: 'gray',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default EntryCard;
