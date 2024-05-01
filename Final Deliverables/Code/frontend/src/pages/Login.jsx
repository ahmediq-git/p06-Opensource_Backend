import { useAtom } from "jotai";
import { useState } from "react";
import { adminAtom } from "../lib/state/adminAtom";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [admin, setAdmin] = useAtom(adminAtom);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData(e.target);

		const email = data.get("email");
		const password = data.get("password");

		const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// 'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
			},
			body: JSON.stringify({ email, password }),
		});

		const resData = await res.json();

		if (resData.error) {
			setError(resData.error);
			setLoading(false);
			return;
		}
		if (resData.data) {
			setAdmin(resData.data);
		} else {
			setAdmin(null);
		}
		// window.localStorage.setItem('jwt', resData.data);

		setTimeout(() => {
			setLoading(false);
			navigate("/");
		}, 100);
	};

	return (
		<div className="h-screen flex items-center justify-center">
			<div className="max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 w-full md:w-1/2 xl:w-1/3">
				<div className="mx-auto">
					<h1 className="text-center text-2xl font-bold text-primary sm:text-3xl shadow-primary">
						Ezbase
					</h1>

					<p className="mx-auto mt-4 max-w-md text-center text-gray-500">
						Admin login
					</p>

					<form
						onSubmit={handleSubmit}
						className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 "
					>
						<div>
							<label htmlFor="email" className="sr-only">
								Email
							</label>

							<div className="relative">
								<input
									type="email"
									name="email"
									className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm text-black"
									placeholder="Enter email"
								/>

								<span className="absolute inset-y-0 end-0 grid place-content-center px-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
										/>
									</svg>
								</span>
							</div>
						</div>

						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>

							<div className="relative">
								<input
									type="password"
									className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm text-black"
									placeholder="Enter password"
									name="password"
								/>

								<span className="absolute inset-y-0 end-0 grid place-content-center px-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								</span>
							</div>
						</div>

						<button
							type="submit"
							className="block w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white"
						>
							Sign in
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
