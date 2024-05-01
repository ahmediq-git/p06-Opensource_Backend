import { UPDATE_STORE, GET_STORE_WITH_FILTERS} from '../enums';


export const updateStore = (cart) => {
  return {
    type: UPDATE_STORE,
    payload:{
        cart
    }
  };
};

export const getStoreWithFilters = (name, minPrice, maxPrice, colors) => {
  return {
    type: GET_STORE_WITH_FILTERS,
    payload:{
      name,
      minPrice,
      maxPrice,
      colors
    }
  }
}