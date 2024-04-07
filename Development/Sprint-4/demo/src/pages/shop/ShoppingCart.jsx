import Layout from "../../components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button
} from "@mui/material";

import {useRef, useEffect, useState, useMemo, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {connect} from 'react-redux'

import {updateBill, clearCart, updateStore} from '../../redux/CombinedActions'

function createData(name, price, quantity) {
  return { name, price, quantity };
}



function ShoppingCart({Cart, updateBill, clearCart, updateStore}) {
   // Renderchecker
   const count = useRef(0);
   useEffect(() => {
       count.current = count.current + 1;
   });

   const [rows, setRows] = useState([])

   useEffect(() => {
     setRows(Cart.map((item)=>createData(item.name, item.price, item.quantity)))
   },[])

   const sum=useMemo(()=>rows.reduce((acc, cur)=>acc+cur.price*cur.quantity, 0), [rows])

   const navigate=useNavigate();

   const handleNavigate=useCallback(()=>{
    if (sum !==0){
      updateStore(Cart)
      updateBill(new Date().toLocaleDateString(), sum)
      clearCart()
      navigate('/checkout')
    }

    }, [Cart,sum])
   
  

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop: 100, flexDirection:'column'}}>
    <h1>Shopping Cart</h1>
    <TableContainer component={Paper} style={{width:1000, border:'1px solid black'}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Typography sx={{marginTop:3}}>Total Cost: {sum} PKR</Typography>
    <Button variant="contained" sx={{marginTop:3, backgroundColor: '#FFA500'}} onClick={handleNavigate}>Proceed to Checkout</Button>
    <div>Rendered: {count.current}</div> 
    {/* Renderchecker */}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    Cart: state.cart.cart,
  };
};

const mapDispatchToProps = {
  updateBill,
  clearCart,
  updateStore
};

export default Layout(
  connect(mapStateToProps, mapDispatchToProps)(ShoppingCart)
);
