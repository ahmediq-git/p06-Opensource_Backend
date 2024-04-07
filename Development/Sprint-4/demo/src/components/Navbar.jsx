import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate("");

  const handleClick = () => {
    navigate("/shopping-cart");
  };

  return (
    <div
      style={{
        backgroundColor: "#FFC947",
        padding: "1rem",
        height: "7vh",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ArrowBackIosIcon
          style={{
            color: "white",
            fontSize: "40",
            marginTop: 8,
            marginLeft: 20,
          }}
          onClick={() => navigate(-1)}
        />
        <h2 style={{ color: "white", fontWeight: "bold" }}>
          Welcome to the Store
        </h2>
        <ShoppingCartIcon
          style={{
            color: "white",
            fontSize: "40",
            marginTop: 8,
            marginRight: 20,
          }}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default Navbar;
