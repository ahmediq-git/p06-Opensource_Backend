import { Card, Box, Typography } from "@mui/material";
// import { ItemImages } from "../utils/ImageExport";
import { Link, useNavigate, createSearchParams } from 'react-router-dom'
import { startTransition, useCallback } from 'react'


const ProductCard = (props) => {
  const navigate = useNavigate();

  const params = { productName: props.productName, price: props.price, sku: props.sku, quantity: props.quantity, color: props.color, image: props.image }

  const handleClick = () => {
    startTransition(() => {
      navigate({ pathname: '/product-page', search: `?${createSearchParams(params)}` } )
    })
  }

  return (
    <div>
      <Card
        sx={{
          display: 'flex',
          width: 270,
          height: 200,
          borderRadius: 3,
          justifyContent: 'center',
          alignItems: 'center',
          border: '14px solid',
          borderColor: 'silver',
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: 2,
          }}
        >
          <img
            src={props.image}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3,
            }}
          />

          <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
            {props.productName}
          </Typography>
          <Typography sx={{ fontSize: 12 }}>{props.price} PKR</Typography>
          <a onClick={handleClick} style={{ color: '#58A422', textDecorationLine: 'underline' }}>Click Here</a>
        </Box>
      </Card>
    </div>
  );
};

export default ProductCard;
