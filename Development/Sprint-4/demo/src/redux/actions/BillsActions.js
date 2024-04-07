import { UPDATE_BILL } from '../enums';

// adds the new bill to list of bills
export const updateBill = (date, price) => {
  return {
    type: UPDATE_BILL,
    payload:{
        date,
        price
    }
  };
};
