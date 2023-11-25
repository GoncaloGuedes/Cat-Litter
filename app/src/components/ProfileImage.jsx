import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ADDRESS} from '../core/api';

const ProfileImage = ({onPress, user, edit}) => {
  const thumbnailSource = user.profile_image;
  const uri = 'http://' + ADDRESS + thumbnailSource;
  console.log(uri);
  return (
    <TouchableOpacity onPress={onPress}>
      <Image style={styles.profileImage} source={{uri}} />
      {edit ? (
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon icon="pencil" size={20} color="#e0e0e0" />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#e0e0e0',
  },
  iconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#202020',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
});

export default ProfileImage;
