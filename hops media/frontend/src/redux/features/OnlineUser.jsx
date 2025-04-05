import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import  {url} from'../../App'
// Redux Slice for Socket state
export const socketForMessage = createSlice({
  name: 'socket',
  initialState: {
    connectedUser: [], // Array of connected users
    message: [] // Array of messages
  },
  reducers: {
    setConnectedUser: (state, action) => {
      const user = action.payload;

      // If the action contains a user, check if they already exist
      const existingUser = state.connectedUser.find(u => u._id === user._id);

      if (existingUser) {
        // If user exists, don't add again (to avoid duplicates)
        return;
      }

      // Add the new user if they don't already exist
      state.connectedUser.push(user);
    },
    removeConnectedUser: (state, action) => {
      // Removes the user from the connectedUser list when they disconnect
      state.connectedUser = state.connectedUser.filter(u => u._id !== action.payload.userid);
    },
    setMessage: (state, action) => {
      state.message.push(action.payload); // Add the new message
    }
  }
});

export const { setConnectedUser, setMessage, removeConnectedUser } = socketForMessage.actions;

// Socket Connection Hook (custom hook)
export const useSocketConnection = () => {
  const dispatch = useDispatch(); // Dispatch actions to Redux

  useEffect(() => {
    const self = localStorage.getItem('ul'); // Get the logged-in user's ID from localStorage
    if (self) {
      const socket = io(`${url}`, { query: { userid: self } });

      // Listen for connected users and dispatch to Redux
      socket.on('connectedUser', (user) => {
        dispatch(setConnectedUser(user));
      });

      // Listen for disconnected users and remove them from the list in Redux
      socket.on('disconnectedUser', (user) => {
        dispatch(removeConnectedUser(user)); // Dispatch action to remove user
      });

      // Listen for new messages and dispatch to Redux
      socket.on('newMessage', (message) => {
        dispatch(setMessage(message)); // Dispatch new message
      });

      // Clean up the socket connection on component unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [dispatch]); // Run the effect once when the component mounts

  return null; // Since this is a hook, it doesn't return JSX
};

export default socketForMessage.reducer;
