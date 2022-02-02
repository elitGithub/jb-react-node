import { createSlice } from "@reduxjs/toolkit";
const initialStateValue = false;
// Exporting the whole slice of data from the store
export const modalSlice = createSlice({
    name: "modal",
    initialState: {
        value: initialStateValue,
    },
    // The actions that can be performed.
    // Basically an object that is a function, that alters the state of the parent object (slice) it takes
    // In this case, login would modify the above defined initial state to whatever was passed as the 'payload' argument
    // So we would have firstName = action.payload.firstName, for example.
    reducers: {
        showHide: (state, action) => {
            state.value = action.payload;
        }
    }
});


// Exporting just the reducer method
export default modalSlice.reducer;

// Exporting just actions as functions
export const { showHide } = modalSlice.actions;
