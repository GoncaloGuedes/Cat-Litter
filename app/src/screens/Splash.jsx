import React, {useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import Title from '../components/Title';

function SplashScreen({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, []);

  return (
    <SafeAreaView style={styles.backgroundContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.wrapper}>
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
    marginTop: 10, // Adjust the marginTop as needed
  },
  activityIndicator: {
    marginTop: 25, // Adjust the marginTop as needed
  },
});

export default SplashScreen;
