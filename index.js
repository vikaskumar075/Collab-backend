

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import docRoutes from './routes/doc.js';
import connectDB from './config/db.js';


dotenv.config();

connectDB();


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/doc', docRoutes);


const socketDocMap = {};

io.on('connection', socket => {
  console.log(` New socket connected: ${socket.id}`);

  socket.on('joinDoc', docId => {
    console.log(` Socket ${socket.id} joined document ${docId}`);
    socket.join(docId);
    socketDocMap[socket.id] = docId;
  });

  socket.on('editDoc', data => {
    const docId = socketDocMap[socket.id];
    if (docId) {
      socket.to(docId).emit('receiveChanges', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(` Socket disconnected: ${socket.id}`);
    delete socketDocMap[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
