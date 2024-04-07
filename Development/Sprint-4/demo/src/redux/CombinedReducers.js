import {combineReducers} from '@reduxjs/toolkit'
import cart from './reducers/CartReducers'
import market from './reducers/StoreReducers'
import bills from './reducers/BillsReducers'

const rootReducer = combineReducers({
    cart,
    market,
    bills
});

export default rootReducer;