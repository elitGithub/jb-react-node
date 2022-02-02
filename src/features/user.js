import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UsersService from "../services/usersService";
import loginService from "../services/loginService";
import LoginService from "../services/loginService";

const initialStateValue = {
    firstName: '',
    lastName: '',
    email: '',
    loggedIn: false,
    token: '',
    isAdmin: false
};

export const register = createAsyncThunk('users/register', async (user, thunk) => {
    try {
        const res = await UsersService.register({ email: user.email, password: user.password, firstName: user.firstName, lastName: user.lastName });
        const data = res.data;
        if (res.hasOwnProperty('success') && res.success === true) {
            return data;
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

export const refresh = createAsyncThunk('users/refresh', async (user, thunk) => {
    return LoginService.checkLogin();
});

export const login = createAsyncThunk('users/login', async (user, thunk) => {
    try {
        const res = await loginService.login(user);
        const data = res.data;
        if (res.hasOwnProperty('success') && res.success === true) {
            return data;
        } else {
            return thunk.rejectWithValue({ success: false, message: res.message ? res.message : 'An error occurred', data: [] });
        }
    } catch (err) {
        let error = err // cast the error for access
        if (!error.response) {
            throw err
        }
        return thunk.rejectWithValue(error.response.data);
    }
});
// Exporting the whole slice of data from the store
export const userSlice = createSlice({
    name: "user",
    initialState: {
        value: initialStateValue,
        pending: null,
        error: false,
    },
    // The actions that can be performed.
    // Basically an object that is a function, that alters the state of the parent object (slice) it takes
    // In this case, login would modify the above defined initial state to whatever was passed as the 'payload' argument
    // So we would have firstName = action.payload.firstName, for example.
    reducers: {
        logout: (state, action) => {
            localStorage.removeItem('token');
            return {
                ...state,
                value: initialStateValue
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(register.pending, (state) => {
                state.status = 'loading';
                state.pending = true;
                state.error = false;
            })
            .addCase(register.rejected, (state) => {
                state.status = 'rejected';
                state.pending = null;
                state.error = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'idle';
                state.pending = null;
                state.error = false;
                state.value = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.pending = true;
                state.error = false;
            })
            .addCase(login.rejected, (state) => {
                state.status = 'rejected';
                state.pending = null;
                state.error = true;
            })
            .addCase(refresh.fulfilled, (state, action) => {
                loginPromiseFulfilled(state, action.payload);
            })
            .addCase(login.fulfilled, (state, action) => {
                loginPromiseFulfilled(state, action.payload);
            });
    }
});

const loginPromiseFulfilled = (state, userData) => {
    state.status = 'idle';
    state.pending = null;
    state.error = false;
    state.value = userData;
    state.value.loggedIn = userData.hasOwnProperty('token') && userData.token.length > 0;
    if (state.value.loggedIn) {
        localStorage.setItem('token', userData.token);
    }
}

// Exporting just the reducer method
export default userSlice.reducer;

// Exporting just actions as functions
export const { logout } = userSlice.actions;
