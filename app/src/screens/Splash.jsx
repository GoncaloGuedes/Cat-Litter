import React, {useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';

import Title from '../components/Title';

// ... (previous imports)

function SplashScreen({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, []);

  return (
    <SafeAreaView style={styles.backgroundContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.wrapper}>
        <Image style={styles.image} source={require('../assets/splash.png')} />
        <Title text="Cat Litter" color="white" />
        <ActivityIndicator size="large" style={styles.activityIndicator} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
  },
  activityIndicator: {
    marginTop: 25, // Adjust the marginTop as needed
  },
  // Define a style for the image
  image: {
    maxWidth: 200, // Set your desired max width
    maxHeight: 200, // Set your desired max height
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },
});

export default SplashScreen;
