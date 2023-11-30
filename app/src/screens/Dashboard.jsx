import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, FlatList} from 'react-native';
import {ADDRESS} from '../core/api';
import secure from '../core/secure';
function DashboardScreen() {
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    const tokens = secure.get('tokens');
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
  }, []);

  return (
    <SafeAreaView>
      <Text>Last 5 Changes:</Text>
      <FlatList
        data={changes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Text>{`Date: ${item.date}, Day of Week: ${item.day_of_week}`}</Text>
        )}
      />
    </SafeAreaView>
  );
}

export default DashboardScreen;
