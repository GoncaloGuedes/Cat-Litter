import React, {useLayoutEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import DashboardScreen from './Dashboard';
import AddEntryScreen from './AddEntry';
import ProfileScreen from './Profile';
import {View, Image, StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();

function HomeScreen({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // profile image
        headerRight: () => (
          <View style={{marginRight: 15}}>
            <Image
              source={require('../assets/profile.png')}
              style={styles.profileImage}
            />
          </View>
        ),

        tabBarIcon: ({focused, color, size}) => {
          const icons = {
            Dashboard: 'chart-simple',
            'New Entry': 'plus',
            Profile: 'user',
          };
          const icon = icons[route.name];
          return <FontAwesomeIcon icon={icon} size={25} color={color} />;
        },
        tabBarActiveTintColor: '#000000',
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="New Entry" component={AddEntryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
  },
});

export default HomeScreen;
