import { createSlice } from "@reduxjs/toolkit";
import { DUMMY_VACATIONS } from "../shared/dummyData";
export const vacationSlice = createSlice({
    name: "vacation",
    initialState: { value: DUMMY_VACATIONS },
    reducers: {
        addVacation: (state, action) => {},
    }
});

export default vacationSlice.reducer;
// Exporting just actions as functions
export const { addVacation } = vacationSlice.actions;