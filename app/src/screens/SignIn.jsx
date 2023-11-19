import React, {useLayoutEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Title from '../components/Title';
import Input from '../components/Input';
import Button from '../components/Button';

function SignInScreen({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrapper}>
        <View>
          <Title text="Cat Litter" color="black" />
          <Input
            title="Email"
            textType="emailAddress"
            keyboardType="email-address"
          />
          <Input title="Password" textType="password" secureTextEntry={true} />
          <Button title="Sign In" />
        </View>
      </KeyboardAvoidingView>
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
