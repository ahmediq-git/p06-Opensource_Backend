import {ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, CHANGE_CART } from '../enums';

// Adds sku to cart, if sku is already in cart, it will increase the quantity
export const addToCart = (sku, productName, color, availableQuantity, price) => {
  return {
    type: ADD_TO_CART,
    payload:{
        sku,
        productName, 
        color,
        availableQuantity,
        price
    }
  };
};

// Removes sku from cart if 0, else increments
export const removeFromCart = (sku, productName, color, availableQuantity, price) => {
    return {
      type: REMOVE_FROM_CART,
      payload:{
        sku,
        productName, 
        color,
        availableQuantity,
        price
      }
    };
  };


export const clearCart = () =>{
  return {
    type: CLEAR_CART
  }
}

export const changeCart=(sku, productName, color, availableQuantity, price, quantity)=>{
  return {
    type: CHANGE_CART,
    payload:{
      sku,
      productName, 
      color,
      availableQuantity,
      price,
      quantity
    }
  }
}