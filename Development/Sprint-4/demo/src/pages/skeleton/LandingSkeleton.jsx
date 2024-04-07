import React from "react";
import { Skeleton, Box } from "@mui/material";

const LandingSkeleton = () => {
  return (
    <div>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ mt: 20 }} />
        <Skeleton width={400} height={60} animation="wave" sx={{ mt: "60px" }} />

        <Skeleton width={250} height={120} animation="wave" sx={{ mt: "10px" }} />
      </Box>
    </div>
  );
}

export default LandingSkeleton;