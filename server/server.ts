
require('dotenv').config({ path: './config/config.env' });
import http from "http";
import { Server } from "socket.io";

import { SocketInit } from "./socket.io";
import app from './config/app';
import connectToDatabase from './config/db';

const server = http.createServer(app);
const io = new Server(server, { cors: {origin: "*"} }) ;

const initializeServer = async () =>
    {
        const PORT = process.env.PORT || 5000;

        await connectToDatabase();
        new SocketInit(io);
        server.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
    };

initializeServer();

export default io;