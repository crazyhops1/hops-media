import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css'
import Navbar from './comp/navbar/Navbar'
import dotenv from 'dotenv/config';
// Importing Components
import Profile from './pages/profile/Profile';
import Post from './comp/post/Post';
import Login from './comp/auth/Login';
import Signup from './comp/auth/Signup';
import Search from './pages/search/Search';
import User from './pages/user/User';
import Protact from './protact-route/protact'; // Protected route wrapper
import Message from './pages/message/Message';
import Chat from './pages/message/Chat';
import { useSelector } from 'react-redux';
import { useSocketConnection } from './redux/features/OnlineUser';

   export const url =process.env.BACKEND_URL
const App = () => {
  const Users = useSelector((state) => state.socket.connectedUser);


  
  useSocketConnection();
 


  return (
<div className='meainContainer'>
<Router>
      <Routes>
        {/* Route for Login with animation - No protection */}
        <Route
          path="/login"
          element={
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }} // Transition duration
            >
              <Login api={url} />
            </motion.div>
          }
        />

        {/* Route for Signup - No protection */}
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes wrapped inside Protact */}
        <Route element={<Protact />}>
       
        <Route path="/" element={<Post />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/contacts" element={<Message onlineUsers={Users} />} />
          <Route path="/chat/:id/:name/:profile" element={<Chat />} />
       
        </Route>
      </Routes>
    </Router>
</div>
  );
};

export default App;
