import React, {useLayoutEffect, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useRoute} from '@react-navigation/native';
import {formatDate, formatTime} from '../core/utils';
import api, {ADDRESS} from '../core/api';

function LoadingView() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={'white'} />
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {message} = route.params;
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true); // Set loading to true when the image request starts
        api.defaults.headers.common['Content-Type'] = 'application/json';
        const response = await api.get(`sandbox/${message.id}/`);
        const uri = `http://${ADDRESS}${response.data.image}`;
        console.log('URI', uri);
        setImageUrl(uri);
      } catch (error) {
        console.log('Error fetching image:', error);
      } finally {
        // Set loading to false once the image is loaded or failed to load
        setLoading(false);
      }
    };

    fetchImage();
  }, [message.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Details',
      headerLeft: () => (
        <View style={styles.backButtonContainer}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={15}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text
            style={styles.backButtonText}
            onPress={() => navigation.goBack()}>
            Back
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleName}>{message.user}</Text>
      <Text style={styles.dateTime}>{formatDate(message)}</Text>
      <Text style={styles.dateTime}>{formatTime(message)}</Text>

      <View style={styles.imageContainer}>
        {imageUrl !== '' && (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        )}
        {loading && <LoadingView />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: 'black',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  titleName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 20,
    color: 'gray',
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center', // Center the loading indicator
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.7,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});

export default DetailsScreen;
