
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IVisibility {
    value:boolean
}

const initialState : IVisibility = {
    value : false,
}

export const loaderVisibility = createSlice({
    name: 'loaderSlice',
    initialState,
    reducers: {
        setLoading: (state:IVisibility, action:PayloadAction<boolean>) => {
            state.value = action.payload;
        }
       
    }
});

export const {setLoading} = loaderVisibility.actions;
export default loaderVisibility.reducer;