import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Homepage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import useSWR from "swr";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { adminAtom } from "../lib/state/adminAtom";

const parseBool = (str) => {
	if (str === "true") {
		return true;
	}

	return false;
};
const fetcher = async (url) => {
	const res = await fetch(url);
	const data = await res.json();

	return parseBool(data);
};
export default function ProtectedRoutes() {
	const { data, error, isLoading } = useSWR(
		"http://127.0.0.1:3690/api/auth/admin",
		fetcher
	);

	const [admin, setAdmin] = useAtom(adminAtom);
	const navigate = useNavigate();

	useLayoutEffect(() => {
		if (admin.loggedIn) {
			navigate("/");
		}
	}, [admin]);

	useLayoutEffect(() => {

		if (data && !admin.loggedIn) {
			navigate("/login");
		} else {
			navigate("/init");
		}
	}, [data]);

	const location = useLocation();

	useLayoutEffect(() => {
		if (!data && location.pathname !== "/init") {
			navigate("/init");
		}

		if (data && location.pathname === "/init") {
			navigate("/login");
		}
	}, [location]);

	return <Outlet></Outlet>;
}
