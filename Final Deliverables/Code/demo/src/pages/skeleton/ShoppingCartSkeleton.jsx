import React from "react";
import { Skeleton, Box } from "@mui/material";

const ShoppingCartSkeleton = () => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Skeleton
        variant="rectangular"
        width={"100vw"}
        height={70}
        animation="wave"
      />

      <Skeleton width={210} height={60} animation="wave" sx={{ mt: "10px" }} />

      <Skeleton
        width={1000}
        height={400}
        animation="wave"
        sx={{ mt: "-60px" }}
      />

      <Skeleton width={100} height={40} animation="wave" sx={{ mt: "-60px" }} />

      <Skeleton width={200} height={60} animation="wave" sx={{ mt: "10px" }} />
    </Box>
  );
};

export default ShoppingCartSkeleton;
