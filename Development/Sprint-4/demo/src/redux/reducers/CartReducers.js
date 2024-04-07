import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, CHANGE_CART } from "../enums";
import {searchObject} from '../../utils/searchObject.js'

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // let foundobj= searchObject(data, 'sku', action.payload.sku)

      let foundobj= searchObject(state.cart, 'sku', action.payload.sku)

      // TODO: TEST FOR CORRECTNESS
      // not found
      if (!foundobj && action.payload.availableQuantity>0){
        let newCartEntry={name: action.payload.productName, quantity:1, price: action.payload.price, sku: action.payload.sku, color: action.payload.color, available: action.payload.availableQuantity}
        return {
          ...state,
          cart:  [...state.cart, newCartEntry],
        }
      }

      return {
        ...state,
        cart: state.cart.map(item => {
          if (item.sku === action.payload.sku) {
            if (item.quantity < item.available){
              return {
                ...item,
                quantity: item.quantity + 1,
              };
            }
          }

          return item;
        }),
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.map(item => {
          if (item.sku === action.payload.sku) {
            if (item.quantity>1){
              return {
                ...item,
                quantity: item.quantity - 1,
              };
            }
            return null
          }
          return item;
        }).filter(item => item !== null ),
      }
    case CHANGE_CART:
      let foundobjcart= searchObject(state.cart, 'sku', action.payload.sku)

      // not found
      if (!foundobjcart && action.payload.availableQuantity>0){
        let newCartEntry={name: action.payload.productName, quantity:action.payload.quantity, price: action.payload.price, sku: action.payload.sku, color: action.payload.color, available: action.payload.availableQuantity}
        return {
          ...state,
          cart:  [...state.cart, newCartEntry],
        }
      }

      return {
        ...state,
        cart: state.cart.map(item => {
          if (item.sku === action.payload.sku) {
            if (action.payload.quantity>0 && action.payload.quantity<=item.available){
              return {
                ...item,
                quantity: action.payload.quantity,
              };
            }
            return null
          }
          return item;
        }).filter(item => item !== null ),
    }

    case CLEAR_CART:
      return {
        ...state,
        cart: []
      }

    default:
      return state;
  }
};

export default cartReducer;