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

const fetcher = async (url) => {
	const res = await fetch(url);
	const data = await res.json();

	return data.data;
};
export default function ProtectedRoutes() {
	const { data, error, isLoading } = useSWR(
		`${import.meta.env.VITE_BACKEND_URL}/auth/admin`,
		fetcher
	);

	const [admin, setAdmin] = useAtom(adminAtom);
	const navigate = useNavigate();
	const location = useLocation();

	useLayoutEffect(() => {
		if (!isLoading && data && admin == null && location.pathname !== "/login") {
			navigate("/login", { replace: true });
		}

		if (admin == null && location.pathname !== "/init") {
			navigate("/init");
		}
	}, [data, admin, navigate]);

	return <Outlet></Outlet>;
}
