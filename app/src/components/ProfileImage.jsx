import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {launchImageLibrary} from 'react-native-image-picker';
import utils from '../core/utils';

export default function ProfileImage() {
  return (
    <TouchableOpacity
      onPress={() => {
        launchImageLibrary(
          {mediaType: 'photo', includeBase64: true},
          response => {
            if (response.didCancel) return;
            const file = response.assets[0];

            // Upload

          },
        );
      }}>
      <Image
        style={styles.profileImage}
        source={require('../assets/profile.png')}
      />
      <View style={styles.iconWrapper}>
        <FontAwesomeIcon icon="pencil" size={20} color="#e0e0e0" />
      </View>
    </TouchableOpacity>
  );
}

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
