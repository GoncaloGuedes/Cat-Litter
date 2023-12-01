import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import FaceID from 'react-native-touch-id';
import {launchCamera} from 'react-native-image-picker';
import Button from '../components/Button';
import api from '../core/api';
import Modal from 'react-native-modal';

function AddEntryScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const formatPrediction = prediction => {
    // Split the prediction string by '_' and capitalize each word
    const words = prediction
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1));
    // Join the words back together with a space
    return words.join(' ');
  };

  const handleBiometric = async () => {
    try {
      await FaceID.authenticate(
        'To securely add a new entry, use FaceID authentication.',
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
        Alert.alert('FaceID not available');
      }
      return false; // Authentication failed
    }
  };

  const handleNewEntry = async () => {
    const authenticationResult = await handleBiometric();

    if (authenticationResult) {
      launchCamera(
        {mediaType: 'photo', includeBase64: false},
        async response => {
          setLoading(true);
          if (response.didCancel) {
            setLoading(false);
            return;
          }

          const file = response.assets[0];

          try {
            const formData = new FormData();
            formData.append('image', {
              type: file.type,
              name: file.fileName || 'image.jpg',
              uri:
                Platform.OS === 'android'
                  ? file.uri
                  : file.uri.replace('file://', ''),
            });
            api.defaults.headers['Content-Type'] = 'multipart/form-data';
            const response = await api.post('sandbox/', formData);

            if (response.status === 201) {
              setModalMessage(response.data.message); // Assuming the message is in the response
              setModalVisible(true);
            }
          } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
          } finally {
            setLoading(false);
          }
        },
      );
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>
        To securely add a new entry, authenticate using Face ID. Capture a
        picture of the clean cat litter afterward.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? <ActivityIndicator size="small" /> : 'Add New Entry'}
          onPress={handleNewEntry}
        />
      </View>
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.text}>The image was predicted as:</Text>
          <Text style={styles.text}>{formatPrediction(modalMessage)}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  okButton: {
    backgroundColor: 'black',
    width: 100,
  },
});

export default AddEntryScreen;
