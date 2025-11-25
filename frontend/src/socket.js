import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  socket = io("http://localhost:5000", {
    transports: ["websocket"],
    query: { userId }
  });
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) socket.disconnect();
};
