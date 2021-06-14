import Config from 'react-native-config';

const io = require('socket.io-client');

let socket = null;
let isConnected = false;
let socketId = null;

const initSocket = (token, url = Config.API_URL) => {
  if (!socket) {
    socket = io(url, {
      query: {token},
      transports: ['websocket'],
      jsonp: false,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      pingTimeout: 1000,
      pingInterval: 1000,
      upgrade: false,
      // rememberUpgrade: true,
    });
  }
};

const getSocketId = () => {
  return socketId;
};

const connect = (action = () => {}) => {
  if (socket) {
    if (!isConnected) {
      socket.on('connect', () => {
        isConnected = true;
        socketId = socket.id;
        action();
      });
      return;
    }
    action();
  }
};

const listenEvent = (name, action) => {
  if (socket) {
    socket.on(name, (data) => {
      action(data);
    });
  }
};

const sendEvent = (name, data, action = () => {}) => {
  if (socket) {
    socket.emit(name, data, (res) => {
      action(res);
    });
  }
};

const offEvent = (name) => {
  if (socket) {
    socket.off(name);
  }
};

const offAllEvent = () => {
  if (socket) {
    socket.removeAllListeners();
  }
};

const disconnect = (callback) => {
  if (socket) {
    socket.on('disconnect', () => {
      callback();
      isConnected = false;
    });
  }
};

const reconnect = (callback) => {
  if (socket) {
    socket.on('reconnect', () => {
      callback();
    });
  }
};

const closeSocket = () => {
  if (socket) {
    socket.close();
    socketId = null;
    isConnected = false;
  }
  socket = null;
};

export default {
  initSocket,
  connect,
  disconnect,
  listenEvent,
  offEvent,
  sendEvent,
  closeSocket,
  getSocketId,
  reconnect,
  offAllEvent,
};
