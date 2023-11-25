import React from 'react';
import {SafeAreaView, Text, View, StyleSheet, Image} from 'react-native';
import Button from '../components/Button';
import ProfileImage from '../components/ProfileImage';
import useAuthStore from '../core/global';

function ProfileScreen() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  return (
    <View style={styles.container}>
      <ProfileImage />
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
    // I want to cover all the space that is left
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
