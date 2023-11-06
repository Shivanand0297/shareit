import { combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "./features/loader/loaderSlice";


const rootReducer = combineReducers({
  loader: loaderReducer,
})

export default rootReducer;