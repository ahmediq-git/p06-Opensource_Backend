import { UPDATE_BILL } from "../enums";

const initialState = {
  bills: []
};

const billsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BILL:
        return {
            ...state,
            bills:  [...state.bills, {date: action.payload.date, price: action.payload.price}],
            }

    default:
      return state;
  }
};

export default billsReducer;
