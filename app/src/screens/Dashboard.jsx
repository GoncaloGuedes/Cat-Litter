// DashboardScreen.js

import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, FlatList} from 'react-native';
import {ADDRESS} from '../core/api';
import secure from '../core/secure';
import EntryCard from '../components/EntryCard';
import utils from '../core/utils';

function DashboardScreen() {
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        const tokens = await secure.get('tokens');

        const socket = new WebSocket(
          `ws://${ADDRESS}/sand_changes/?token=${tokens.access}`,
        );

        socket.onopen = () => {
          console.log('WebSocket Connection Open');
        };

        socket.onmessage = event => {
          const data = JSON.parse(event.data);
          setChanges(data.message);
        };

        socket.onclose = () => {
          console.log('WebSocket Connection Closed');
        };

        return () => {
          socket.close();
        };
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
      }
    };

    initializeWebSocket();
  }, []);

  useEffect(() => {}, [changes]);

  return (
    <SafeAreaView>
      <Text>Last 5 Changes:</Text>
      <FlatList
        data={changes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <EntryCard message={item} />}
      />
    </SafeAreaView>
  );
}

export default DashboardScreen;
