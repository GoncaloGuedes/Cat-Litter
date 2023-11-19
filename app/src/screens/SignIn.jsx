import React, {useLayoutEffect, useState} from 'react';

import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import Title from '../components/Title';
import Input from '../components/Input';
import Button from '../components/Button';

function SignInScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, []);

  function onSignIn() {
    // Validate email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isEmailValid = emailRegex.test(email);
    setErrorEmail(isEmailValid ? '' : 'Please enter a valid email address');

    // Validate password
    const isPasswordValid = password.length >= 8;
    setErrorPassword(
      isPasswordValid ? '' : 'Password must be at least 8 characters',
    );

    // Check for errors and return if there are any
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Make API call to sign in
    console.log('Sign in', email, password);
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
            <Button title="Sign In" onPress={onSignIn} />
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
