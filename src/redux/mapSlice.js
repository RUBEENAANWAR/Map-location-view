import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    savedLocations: [],
  },
  reducers: {
    saveLocation: (state, action) => {
      state.savedLocations.push(action.payload);
    },
    // removeLocation: (state, action) => {
    //   const locationIndex = state.savedLocations.findIndex(
    //     (location) => location.time === action.payload
    //   );
  
    //   if (locationIndex !== -1) {
    //     state.savedLocations.splice(locationIndex, 1);
    //   }
    // },
    removeLocation: (state, action) => {
      state.savedLocations = state.savedLocations.filter(
        (location) => location.time !== action.payload
      );
    },
  },
 
});

export const { saveLocation,removeLocation } = mapSlice.actions;
export const selectSavedLocations = (state) => state.map.savedLocations;
export default mapSlice.reducer;