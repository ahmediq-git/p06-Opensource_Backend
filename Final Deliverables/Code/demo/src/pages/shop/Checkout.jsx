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
} from "@mui/material";
import { useRef, useEffect, useState } from 'react'

import { connect } from 'react-redux'

function createData(date, price) {
  return { date, price };
}


function Checkout({ Bills }) {
  // Renderchecker
  const count = useRef(0);
  useEffect(() => {
    count.current = count.current + 1;
  });


  const [rows, setRows] = useState([])

  useEffect(() => {
    setRows(Bills.map((item) => createData(item.date, item.price)))
  }, [Bills])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100, flexDirection: 'column' }}>
      <h2 style={{ color: "#660000" }}>Thank you for shopping with us</h2>
      <h1>These are your past Bills</h1>
      <TableContainer component={Paper} style={{ width: 1000, border: '1px solid black' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography sx={{ marginTop: 3 }}>Total Spent: 123</Typography>
      <div>Rendered: {count.current}</div>
      {/* Renderchecker */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    Bills: state.bills.bills,
  };
};



// add mapDispatchToProps
export default Layout(
  connect(mapStateToProps)(Checkout)
);
