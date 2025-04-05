import { createSlice } from '@reduxjs/toolkit';

// Initial state for the search value
const initialState = {
  value: ''
};

// Creating the search slice
export const searchValue = createSlice({
  name: 'search',
  initialState,  // Set the initial state here
  reducers: {
    setSearchValue: (state, action) => {
      // Update the search value in the state when this action is dispatched
      state.value = action.payload;
    }
  }
});

// Export the action so it can be dispatched
export const { setSearchValue } = searchValue.actions;












// Export the reducer to be used in the store
export default searchValue.reducer;