import { io } from "socket.io-client";

const SOCKET_URL = "https://workorg-server.onrender.com";
export const socket = io(SOCKET_URL);
