import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import vacationService from "../services/vacationService";

export const followVacation = createAsyncThunk('vacations/follow', async (id, thunk) => {
    try {
        const res = await vacationService.follow(id);
        if (res.hasOwnProperty('success') && res.success === true) {
            return res.data;
        } else {
            return thunk.rejectWithValue(res.hasOwnProperty('message') ? res.message : 'An error occurred during registration.');
        }
    } catch (err) {
        let error = err; // cast the error for access
        if (!error.response) {
            throw err;
        }
        return thunk.rejectWithValue(error.response.data);
    }
});

export const createVacation = createAsyncThunk('vacations/create', async (vacation, thunk) => {
    const res = await vacationService.create(vacation);
    if (res.hasOwnProperty('success') && res.success === true) {
        const response = await vacationService.list();
        if (response.hasOwnProperty('success') && response.success === true) {
            return response;
        } else {
            return thunk.rejectWithValue(res.hasOwnProperty('message') ? res.message : 'Could not get vacation list.');
        }
    } else {
        return thunk.rejectWithValue(res.hasOwnProperty('message') ? res.message : 'An error occurred during vacation creation.');
    }
});

export const listVacations = createAsyncThunk('vacations/list', async () => {
    const res = await vacationService.list();
    if (res.hasOwnProperty('success') && res.success) {
        return res.data;
    }
});


export const vacationSlice = createSlice({
    name: "vacation",
    initialState: { value: {} },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(followVacation.pending, (state) => {
                state.status = 'loading';
                state.pending = true;
                state.error = false;
            })
            .addCase(followVacation.rejected, (state) => {
                state.status = 'rejected';
                state.pending = null;
                state.error = true;
            })
            .addCase(followVacation.fulfilled, (state, action) => {
                state.status = 'idle';
                state.pending = null;
                state.error = false;
                state.value = action.payload;
            })
            .addCase(listVacations.pending, (state) => {
                state.status = 'loading';
                state.pending = true;
                state.error = false;
            })
            .addCase(listVacations.rejected, (state) => {
                state.status = 'rejected';
                state.pending = null;
                state.error = true;
            })
            .addCase(listVacations.fulfilled, (state, action) => {
                state.status = 'idle';
                state.pending = null;
                state.error = false;
                state.value = action.payload;
            })
            .addCase(createVacation.fulfilled, (state, action) => {
                state.status = 'idle';
                state.pending = null;
                state.error = false;
                state.value = action.payload;
            })
            .addCase(createVacation.rejected, (state, action) => {
                state.status = 'rejected';
                state.pending = null;
                state.error = true;
            })
            .addCase(createVacation.pending, (state, action) => {
                state.status = 'loading';
                state.pending = true;
                state.error = false;
            })
    }
});

export default vacationSlice.reducer;
// Exporting just actions as functions
export const {} = vacationSlice.actions;
