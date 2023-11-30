import {create} from 'zustand';
import secure from './secure';
import api, {ADDRESS} from './api';
import utils from './utils';

// Authentication store
const useAuthStore = create((set, get) => ({
  // Authentication state
  initialized: false,
  authenticated: false,
  user: {},
  socket: null,

  // Authentication actions
  actions: {
    init: async () => {
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
          const {user, tokens} = response.data;

          secure.set('user', user);
          secure.set('tokens', tokens);
          console.log(tokens);

          set(state => ({
            initialized: true,
            authenticated: true,
            user,
          }));
          return;
        } catch (error) {
          console.log('GLOBAL INIT ERROR ', error);
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
  },

  // Socket handling
  socket: null,
  socketActions: {
    connect: async () => {
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
          thumbnail: (set, get, data) => {
            set(state => ({
              user: data,
            }));
          },
          // Add more response handlers as needed
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
        // Call disconnect function when the socket is closed
        set(state => ({socket}));
        get().socketActions.disconnect();
      };

      set(state => ({socket}));
    },

    disconnect: () => {
      utils.log('SOCKET CLOSED');
      // Set socket to null in the state
      set({socket: null});
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
  },
}));

export default useAuthStore;
