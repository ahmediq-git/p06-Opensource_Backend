import React from "react";
import { Skeleton, Box } from "@mui/material";

const ProductPageSkeleton = () => {
  return (
    <div>
      <Box
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Skeleton
          variant="rectangular"
          width={"100vw"}
          height={70}
          animation="wave"
        />

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Box sx={{ justifyContent: 'left' }}>
            <Skeleton
              width={420}
              height={550}
              animation="wave"
              sx={{ ml: 3, mt: -5 }}
            />
          </Box>
          <Box>
            <Skeleton
              width={400}
              height={50}
              animation="wave"
              sx={{ ml: -100, mt: 8 }}
            />

            <Skeleton
              width={200}
              height={250}
              animation="wave"
              sx={{ ml: -100, mt: -5 }}
            />

            <Skeleton
              width={220}
              height={150}
              animation="wave"
              sx={{ ml: -100, mt: -5 }}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ProductPageSkeleton;
