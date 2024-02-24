import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import Logs from "./pages/Logs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import Logs from "./components/Logs";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* <Route path="/" element={<ProtectedRoutes />}> */}
				<Route path="/" element={<HomePage />}></Route>
				<Route path="/logs" element={<Logs />}></Route>
					{/* <Route path="/login" element={<Login />}></Route>
					<Route path="/init" element={<Signup />}></Route> */}
				{/* </Route> */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
