import React from 'react';
import {SafeAreaView, Text, View, StyleSheet, Image} from 'react-native';
import Button from '../components/Button';
import ProfileImage from '../components/ProfileImage';
import useAuthStore from '../core/global';
import {launchImageLibrary} from 'react-native-image-picker';

function ProfileScreen() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.actions.logout);
  const uploadThumbnail = useAuthStore(state => state.socketActions.uploadThumbnail);

  const handleUploadProfileImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, response => {
      if (response.didCancel) return;
      const file = response.assets[0];
      uploadThumbnail(file);
    });
  };

  return (
    <View style={styles.container}>
      <ProfileImage
        onPress={handleUploadProfileImage}
        user={user}
        edit={true}
      />
      <Text style={styles.name}>
        {user.first_name} {user.last_name}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
