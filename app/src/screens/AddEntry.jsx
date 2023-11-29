import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet, Platform} from 'react-native';
import FaceID from 'react-native-touch-id';
import {launchCamera} from 'react-native-image-picker';
import Button from '../components/Button';
import api from '../core/api';

function AddEntryScreen({navigation}) {
  const [capturedImageURI, setCapturedImageURI] = useState('');

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
      launchCamera(
        {mediaType: 'photo', includeBase64: false}, // Do not include base64
        async response => {
          if (response.didCancel) return;

          const file = response.assets[0];

          try {
            const formData = new FormData();
            formData.append('image', {
              type: file.type,
              name: file.fileName || 'image.jpg', // Provide a default name if not available
              uri:
                Platform.OS === 'android'
                  ? file.uri
                  : file.uri.replace('file://', ''),
            });
            api.defaults.headers['Content-Type'] = 'multipart/form-data';
            const response = await api.post('sandbox/', formData);
          } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
          }
        },
      );
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
