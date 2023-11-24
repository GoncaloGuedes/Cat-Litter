import React from 'react';
import {SafeAreaView, Text, View, StyleSheet, Image} from 'react-native';
import Button from '../components/Button';
import useAuthStore from '../core/global';

function ProfileScreen() {
  const logout = useAuthStore(state => state.logout);
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/profile.png')}
        style={styles.profileImage}
      />
      <Text style={styles.name}>Gonçalo Guedes</Text>
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
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#e0e0e0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  buttonContainer: {
    // I want to cover all the space that is left
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
