import {createSlice} from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user: null,
    },
    reducers: { // contains the value to manage the loading
        SetUser: (state, action) => {
            state.user = action.payload;
        }
    } 
});

export const {SetUser} = usersSlice.actions;