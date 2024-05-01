import {
  Box,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useRef, useState } from 'react'

import { connect } from 'react-redux'
import { getStoreWithFilters } from '../redux/actions/StoreActions'

const Filter = ({ getStoreWithFilters }) => {

  // Renderchecker
  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [colors, setColors] = useState(["Red", "Green", "Purple", "Yellow", "Blue"]);

  const count = useRef(0);
  useEffect(() => {
    count.current = count.current + 1;

  });

  useEffect(() => {

    getStoreWithFilters(name, minPrice, maxPrice, colors)
  }, [name, minPrice, maxPrice, colors])


  const handleColorChange = (color) => {
    setColors((prevSelectedColors) => {
      if (prevSelectedColors.includes(color)) {
        return prevSelectedColors.filter((c) => c !== color);
      } else {
        return [...prevSelectedColors, color];
      }
    });
  };

  return (
    <Box
      sx={{
        width: 250,
        height: 550,
        backgroundColor: "#d3d3d3",
        borderRadius: 2,
        marginRight: 5,
      }}
    >
      <div>Rendered: {count.current}</div>
      {/* Renderchecker */}
      <Typography
        sx={{
          color: "black",
          fontSize: 30,
          fontWeight: "bold",
          textDecorationLine: "underline",
          justifyContent: "center",
          p: 10,
          pt: 1,
          pb: 1,
        }}
      >
        Filters
      </Typography>
      <Typography
        sx={{
          color: "black",
          fontSize: 20,
          fontWeight: "bold",
          justifyContent: "center",
          p: 10,
          pt: 1,
          pb: 1,
          ml: 2,
        }}
      >
        Name
      </Typography>

      <TextField
        sx={{
          width: 200,
          height: 55,
          backgroundColor: "white",
          borderRadius: 2,
          marginLeft: 3,
        }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Typography
        sx={{
          color: "black",
          fontSize: 20,
          fontWeight: "bold",
          justifyContent: "center",
          p: 10,
          pt: 1,
          pb: 1,
          ml: 2,
        }}
      >
        Price
      </Typography>

      <Box
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <Typography
          sx={{
            color: "black",
            fontSize: 20,
            fontWeight: "bold",
            justifyContent: "center",
            mt: 2,
            mr: 2,
          }}
        >
          Between:
        </Typography>
        <TextField
          sx={{
            width: 100,
            height: 55,
            backgroundColor: "white",
            borderRadius: 2,
          }}
          type="number"
          value={minPrice}
          onChange={(e) => {
            if (isNaN(e.target.value)) {
              setMinPrice(0)
            }
            else {
              setMinPrice(parseFloat(e.target.value))
            }
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <Typography
          sx={{
            color: "black",
            fontSize: 20,
            fontWeight: "bold",
            justifyContent: "center",
            mt: 2,
            mr: 2,
            ml: 5,
          }}
        >
          And:
        </Typography>
        <TextField
          sx={{
            width: 100,
            height: 55,
            backgroundColor: "white",
            borderRadius: 2,
          }}
          type="number"
          value={maxPrice}
          onChange={(e) => {
            if (isNaN(e.target.value)) {
              console.log("here")
              setMaxPrice(0)
            }
            else {
              setMaxPrice(parseFloat(e.target.value))
            }
          }}
        />
      </Box>

      <Typography
        sx={{
          color: "black",
          fontSize: 20,
          fontWeight: "bold",
          justifyContent: "center",
          p: 10,
          pt: 1,
          pb: 0,
          ml: 2,
        }}
      >
        Color
      </Typography>

      <FormGroup sx={{ marginLeft: 10 }}>
        <FormControlLabel
          sx={{ mb: -2 }}
          control={<Checkbox checked={colors.includes("Red")} />}
          label="Red"
          value="Red"
          onChange={() => { handleColorChange("Red") }}
        />
        <FormControlLabel
          sx={{ mb: -2 }}
          control={<Checkbox checked={colors.includes("Green")} />}
          label="Green"
          value="Green"
          onChange={() => { handleColorChange("Green") }}
        />
        <FormControlLabel
          sx={{ mb: -2 }}
          control={<Checkbox checked={colors.includes("Blue")} />}
          label="Blue"
          value="Blue"
          onChange={() => { handleColorChange("Blue") }}
        />
        <FormControlLabel
          sx={{ mb: -2 }}
          control={<Checkbox checked={colors.includes("Yellow")} />}
          label="Yellow"
          value="Yellow"
          onChange={() => { handleColorChange("Yellow") }}
        />

        <FormControlLabel
          sx={{ mb: -2 }}
          control={<Checkbox checked={colors.includes("Purple")} />}
          label="Purple"
          value="Purple"
          onChange={() => { handleColorChange("Purple") }}
        />
      </FormGroup>
    </Box>
  );
};

const mapDispatchToProps = {
  getStoreWithFilters
}

export default connect(null, mapDispatchToProps)(Filter);
