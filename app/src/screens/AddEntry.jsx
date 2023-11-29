import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import FaceID from 'react-native-touch-id';
import {launchCamera} from 'react-native-image-picker';
import Button from '../components/Button';
import api from '../core/api';

function AddEntryScreen({navigation}) {
  const handleBiometric = async () => {
    try {
      await FaceID.authenticate(
        'To securely add a new entry, use Face ID authentication.',
      );
      return true; // Authentication successful
    } catch (error) {
      console.log(error);
      if (error.name === 'LAErrorAuthenticationFailed') {
        Alert.alert('Authentication Failed. Please try again.');
      }
      if (
        error.name === 'LAErrorTouchIDNotAvailable' ||
        error.name === 'LAErrorTouchIDNotEnrolled'
      ) {
        Alert.alert('Face ID not available');
      }
      return false; // Authentication failed
    }
  };

  const handleNewEntry = async () => {
    const authenticationResult = await handleBiometric();

    if (authenticationResult) {
      // Launch camera
      launchCamera({mediaType: 'photo'}, response => {
        if (response.didCancel) return;
        const file = response.assets[0];
        console.log(file);
        const formData = new FormData();
        formData.append('file', {
          image: file.uri,
          name: file.fileName,
          type: file.type,
        });
        api
          .post('sandbox/', formData)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
          });
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>
        To securely add a new entry, authenticate using Face ID. Capture a
        picture of the clean cat litter afterward.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title={'Add New Entry'} onPress={handleNewEntry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'light',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default AddEntryScreen;
