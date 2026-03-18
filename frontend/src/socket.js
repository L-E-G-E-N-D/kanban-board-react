import { io } from "socket.io-client";
import API_BASE_URL from "./api";

const socket = io(API_BASE_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export function connectSocket(token) {
  socket.auth = token ? { token } : {};
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export default socket;
