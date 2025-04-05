import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../features/Searchvalue';
import { socketForMessage } from '../features/OnlineUser';

export default configureStore({
  reducer: {
    search: searchReducer,  // search reducer for handling search logic
    socket: socketForMessage.reducer,  // Ensure you're using the reducer exported from socket slice
  }
});
