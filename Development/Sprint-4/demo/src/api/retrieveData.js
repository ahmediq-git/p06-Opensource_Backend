import axios from "axios";

export async function fetchData() {
  return await axios.get('https://fakestoreapi.com/products')
    .then(response => {
      return response.data

    }).catch(error => {
      throw error.response.data
    })
}