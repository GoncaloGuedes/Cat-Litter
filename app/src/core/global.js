import {create} from 'zustand';
import secure from './secure';
import api, {ADDRESS} from './api';
import utils from './utils';

// socket responses handlers
const responseThumbnail = (set, get, data) => {
  set(state => ({
    user: data,
  }));
};

// Authentication store
const useAuthStore = create((set, get) => ({
  initialized: false,
  authenticated: false,
  user: {},
  socket: null,

  init: async () => {
    // Get credentials
    const credentials = await secure.get('credentials');
    if (credentials) {
      try {
        const response = await api({
          method: 'POST',
          url: '/auth/jwt/create/',
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        });
        const user = response.data.user;
        const tokens = response.data.tokens;

        secure.set(user);
        secure.set('tokens', tokens);

        set(state => ({
          initialized: true,
          authenticated: true,
          user,
        }));
        return;
      } catch (error) {
        console.log(error);
      }
    }
    set(state => ({
      initialized: true,
    }));
  },

  login: (credentials, user, tokens) => {
    secure.set('credentials', credentials);
    secure.set('tokens', tokens);
    set({authenticated: true, user});
  },

  logout: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    secure.wipe();
    set({authenticated: false, user: {}});
  },

  socket: null,
  socketConnect: async () => {
    const tokens = await secure.get('tokens');
    const socket = new WebSocket(
      `ws://${ADDRESS}/users/?token=${tokens.access}`,
    );

    socket.onopen = () => {
      utils.log('socket.onopen');
    };

    socket.onmessage = event => {
      const parsedData = JSON.parse(event.data);
      utils.log('Received WebSocket message:', parsedData);

      const response = {
        thumbnail: responseThumbnail,
      };

      const resp = response[parsedData.source];
      if (!resp) {
        utils.log('socket.onmessage' + parsedData.source + ' not found');
        return;
      }

      resp(set, get, parsedData.data);
    };

    socket.onerror = e => {
      utils.log('socket.onerror', e);
    };

    socket.onclose = () => {
      utils.log('socket.onclose');
    };

    set(state => ({socket}));
  },

  socketDisconnect: () => {
    utils.log('SOCKET CLOSED');
  },

  uploadThumbnail: async file => {
    const socket = get().socket;
    socket.send(
      JSON.stringify({
        source: 'thumbnail',
        base64: file.base64,
        filename: file.fileName,
      }),
    );
  },
}));

export default useAuthStore;
