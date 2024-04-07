import { UPDATE_STORE, GET_STORE_WITH_FILTERS } from "../enums";
import { fetchData } from "../../api/retrieveData";


let fulldata=[]


fetchData().then((data)=>{fulldata=data}).catch((error)=>{console.log(error)})

const initialState = {
  products: fulldata
};


const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_STORE:
      // It's better to create a new copy of the state and modify that instead of modifying the original state directly
      const updatedProducts = state.products.map(product => {
        const matchingCartItem = action.payload.cart.find(cartItem => cartItem.sku === product.sku);
        if (matchingCartItem) {
          return {
            ...product,
            quantity: product.quantity - matchingCartItem.quantity
          };
        }
        return product;
      });
      return { ...state, products: updatedProducts }; // Return the updated state

    case GET_STORE_WITH_FILTERS:

      const { name, minPrice, maxPrice, colors } = action.payload;

      // If any filter value is missing or falsy, reset to initial state

      if (name === undefined || minPrice === undefined || maxPrice === undefined || colors === undefined || colors.length===0) {
        console.log(initialState)
        return initialState;
      }
      
      let filteredProducts = fulldata; // Start with all data
      
      if (name) {
        filteredProducts = filteredProducts.filter(product => product.name.includes(name));
      }
      
      filteredProducts = filteredProducts.filter(product => {
        const parsedMinPrice = parseFloat(minPrice);
        const parsedMaxPrice = parseFloat(maxPrice);
      
        const minPriceMatch = isNaN(parsedMinPrice) || product.price >= parsedMinPrice;
        const maxPriceMatch = isNaN(parsedMaxPrice) || product.price <= parsedMaxPrice;
        const colorsMatch = !colors || colors.includes(product.color);
      
        return minPriceMatch && maxPriceMatch && colorsMatch;
      });
    
    return {
      ...state,
      products: filteredProducts
    };
    

    default:
      return state;
  }
};

export default storeReducer;
