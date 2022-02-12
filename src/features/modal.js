import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import vacationService from "../services/vacationService";


const initialStateValue = { isShown: false, vacation: false };

export const edit = createAsyncThunk('modal/editMode', async (id, thunk) => {
    const res = await vacationService.one(id);
    if (res.hasOwnProperty('success') && res.success === true) {
        return res;
    } else {
        return thunk.rejectWithValue(res.hasOwnProperty('message') ? res.message : 'An error occurred during registration.');
    }
});

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
            state.value.isShown = action.payload;
            if (!action.payload) {
                state.value.vacation = {};
            }
        },
    }, extraReducers: builder => {
        builder
            .addCase(edit.pending, (state) => {
                state.status = 'loading';
                state.pending = true;
                state.error = false;
            })
            .addCase(edit.rejected, (state) => {
                state.status = 'rejected';
                state.pending = null;
                state.error = true;

            })
            .addCase(edit.fulfilled, (state, action) => {
                state.status = 'idle';
                state.pending = null;
                state.error = false;
                state.value.isShown = true;
                state.value.vacation = action.payload.data;
            })
    }
});


// Exporting just the reducer method
export default modalSlice.reducer;

// Exporting just actions as functions
export const { showHide } = modalSlice.actions;
