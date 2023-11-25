import React, {useLayoutEffect, useState} from 'react';

import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

import Title from '../components/Title';
import Input from '../components/Input';
import Button from '../components/Button';

import api from '../core/api';
import utils from '../core/utils';

import useAuthStore from '../core/global';

function SignInScreen({navigation}) {
  // Get global state
  const login = useAuthStore(state => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, []);

  function onSignIn() {
    // Clear errors
    setErrorEmail('');
    setErrorPassword('');
    setLoading(true);

    // Validate email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isEmailValid = emailRegex.test(email);
    setErrorEmail(isEmailValid ? '' : 'Please enter a valid email address');

    // Validate password
    const isPasswordValid = password.length >= 1;
    setErrorPassword(
      isPasswordValid ? '' : 'Password must be at least 8 characters',
    );

    // Check for errors and return if there are any
    if (!isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }

    // Make API call to sign in
    api({
      method: 'POST',
      url: '/auth/jwt/create/',
      data: {
        email,
        password,
      },
    })
      .then(response => {
        utils.log(response.data);
        const credentials = {
          email,
          password,
        };
        setLoading(false);
        login(credentials, response.data.user);
      })
      .catch(error => {
        if (error.response) {
          // If status code is 401, show error message
          if (error.response.status === 401) {
            setErrorPassword('Invalid email or password');
          }
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.wrapper}>
          <View>
            <Title text="Cat Litter" color="black" />
            <Input
              title="Email"
              textType="emailAddress"
              keyboardType="email-address"
              value={email}
              setValue={setEmail}
              error={errorEmail}
              setError={setErrorEmail}
            />
            <Input
              title="Password"
              textType="password"
              secureTextEntry={true}
              value={password}
              setValue={setPassword}
              error={errorPassword}
              setError={setErrorPassword}
            />
            <Button
              title={loading ? <ActivityIndicator size="small" /> : 'Sign In'}
              onPress={onSignIn}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SignInScreen;
