import React from "react";
import { Skeleton, Box } from "@mui/material";

const HomepageSkeleton = () => {
    return (
        <Box
            sx={{ display: "flex", flexDirection: "column" }}
        >
            <Skeleton
                variant="rectangular"
                width={"100vw"}
                height={70}
                animation="wave"
            />

            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ m: 2 }}>
                    <Skeleton
                        variant="rectangular"
                        width={250}
                        height={510}
                        animation="wave"
                    />
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: -8 }}>
                        <Skeleton width={300} height={400} animation="wave" sx={{ ml: 2 }} />
                        <Skeleton width={300} height={400} animation="wave" sx={{ ml: 2 }} />
                        <Skeleton width={300} height={400} animation="wave" sx={{ ml: 2 }} />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: -18 }}>
                        <Skeleton width={300} height={400} animation="wave" sx={{ ml: 2 }} />
                        <Skeleton width={300} height={400} animation="wave" sx={{ ml: 2 }} />
                        <Skeleton width={300} height={400} animation="wave" sx={{ ml: 2 }} />
                    </Box>


                </Box>
            </Box>

        </Box>
    );
}

export default HomepageSkeleton;