import axios from 'axios'

function getRandomColorFromSet() {
  const colors = ['Yellow', 'Red', 'Green', 'Blue', 'Purple'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function getRandomCode(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset[randomIndex];
    }
    return code;
}

const modifyResponse = (data)=>{
    const changeName = data.map(({
        title: name,
        ...rest
      }) => ({
        name,
        ...rest
      }));
    
    const addQty = changeName.map((obj) => ({
        ...obj,          
        quantity: obj.rating.count,
        price: Math.floor(obj.price*270)
    }));
    
    const addSku = addQty.map((obj) => ({
        ...obj,          
        sku: getRandomCode(8)
    }));

    const addColor = addSku.map((obj) => ({
        ...obj,
        color: getRandomColorFromSet()
    }));

    return addColor;
}

const AxiosConfiguration = () => {
    axios.interceptors.response.use(
      (response) => {
        if (response.config.url === 'https://fakestoreapi.com/products') {
          let totaldata=[]
          for (let i = 0; i < response.data.length; i++) {
            totaldata=totaldata.concat(modifyResponse(response.data))
          }

          response.data = totaldata;
        }
       return response
      },
      (error)=>{
        return Promise.reject(error);
      }
    )
  }
  
  export default AxiosConfiguration;