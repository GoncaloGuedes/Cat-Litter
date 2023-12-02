import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {ADDRESS} from '../core/api';

const EntryCard = ({message}) => {
  const profileImageSource = message.profile_image
    ? {uri: `http://${ADDRESS}${message.profile_image}`}
    : require('../assets/profile.png');

  return (
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
  );
};

const formatDate = message => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(message.date);
  return date.toLocaleDateString(undefined, options);
};

const formatTime = message => {
  const options = {hour: '2-digit', minute: '2-digit'};
  const time = new Date(message.date);
  return time.toLocaleTimeString(undefined, options);
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
