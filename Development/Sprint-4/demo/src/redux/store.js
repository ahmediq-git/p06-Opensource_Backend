import {configureStore} from '@reduxjs/toolkit'
import rootReducer from "./CombinedReducers";

export default configureStore({
  reducer: rootReducer
});