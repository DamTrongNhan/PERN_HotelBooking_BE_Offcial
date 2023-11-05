import { Server } from "socket.io";
import "dotenv/config";

const createIO = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.REACT_URL,
      credentials: true,
    },
  });
  return io;
};

export default createIO;
