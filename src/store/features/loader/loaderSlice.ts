import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type InitialState = {
  isLoading: boolean
}

const initialState: InitialState = {
  isLoading: false,
}

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoader: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  }
})

export const { setLoader } = loaderSlice.actions;
const loaderReducer = loaderSlice.reducer;
export default loaderReducer;