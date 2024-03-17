import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import Logs from "./pages/Logs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import RealtimeTest from "./pages/RealtimeTest";
import FunctionsPage from "./pages/Functions";
import StressTestPage from "./pages/StressTest";
import SchemaPage from "./pages/SchemaPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<ProtectedRoutes />}>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/logs" element={<Logs />}></Route>
					<Route path="/settings" element={<Settings />}></Route>
					<Route path="/rt" element={<RealtimeTest />}></Route>
					<Route path="/functions" element={<FunctionsPage />}></Route>
					<Route path="/stress" element={<StressTestPage />}></Route>
					<Route path="/schema" element={<SchemaPage />}></Route>
					{/* <Route path="/login" element={<Login />}></Route>
					<Route path="/init" element={<Signup />}></Route> */}
					{/* </Route> */}
					<Route path="/login" element={<Login />}></Route>
					<Route path="/init" element={<Signup />}></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
