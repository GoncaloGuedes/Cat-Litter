import React, {useEffect, useState} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import './src/core/fontawesome';

import SplashScreen from './src/screens/Splash';
import SignInScreen from './src/screens/SignIn';
import HomeScreen from './src/screens/Home';

import useAuthStore from './src/core/global';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const Stack = createNativeStackNavigator();

function App() {
  const initialized = useAuthStore(state => state.initialized);
  const isAuthenticated = useAuthStore(state => state.authenticated);
  const init = useAuthStore(state => state.init);

  useEffect(() => {
    init();
  }, []);
  return (
    <NavigationContainer theme={LightTheme}>
      <Stack.Navigator>
        {!initialized ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
          </>
        ) : !isAuthenticated ? (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
