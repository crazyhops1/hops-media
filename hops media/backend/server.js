import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import dbConnection from './database/database.js';
import cors from 'cors';
import authRouter from './router/auth.router.js';
import userRouter from './router/user.router.js';
import postRouter from './router/post.router.js';
import messageRouter from './router/message.router.js';
import { app, server } from './socket/socket.js';

// CORS Setup
const corsOptions = {
  origin: process.env.FRONTEND,
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.send('API running 🚀');
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/message', messageRouter);

// ✅ Connect DB first, then start server
const startServer = async () => {
  try {
    await dbConnection();
    console.log('✅ Database connected successfully');

    server.listen(process.env.PORT, () => {
      console.log('🚀 Server running on port', process.env.PORT);
    });
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    process.exit(1); // Exit if DB fails
  }
};

startServer();
