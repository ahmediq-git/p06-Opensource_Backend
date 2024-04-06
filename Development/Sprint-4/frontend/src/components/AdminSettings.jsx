import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";
import { useEffect } from "react";
import { AdminSignupForm } from "../pages/Signup";


export default function Admins() {
	const { data, error, isLoading } = useSWR(
		"http://localhost:3690/api/auth/admins",
		fetcher
	);
    const { mutate } = useSWRConfig();

	useEffect(() => {
		console.log("Admins page");
		console.log("data", data);
		console.log("error", error);
		console.log("isLoading", isLoading);
	}, [data, error, isLoading]);

	const deleteAdmin = async (email) => {
		const res = await fetch("http://localhost:3690/api/auth/admin/delete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				// 'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
			},
			body: JSON.stringify({ email }),
		});

		const resData = await res.json();

		if (resData.error) {
			console.error(resData.error);
			return;
		}

        mutate("http://localhost:3690/api/auth/admins");
	};

	return (
		<div className="flex flex-col gap-10">
			{/* add admin button */}
			<div className="flex justify-between">
				<h1 className="font-bold text-xl">Admins</h1>

				<label className="btn btn-primary" htmlFor="add-admin-modal">
					Add
				</label>
				<input className="modal-state" id="add-admin-modal" type="checkbox" />
				<div className="modal">
					<label className="modal-overlay" htmlFor="add-admin-modal"></label>
					<div className="modal-content flex flex-col gap-5 w-1/3">
						<label
							htmlFor="add-admin-modal"
							className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						>
							✕
						</label>
						<h2 className="text-xl">New Admin</h2>
						<AdminSignupForm redirectTo="/settings"/>
					</div>
				</div>
			</div>

			<div className="flex w-full overflow-x-auto">
				<table className="table">
					<thead>
						<tr>
							<th>Email</th>
							<th>Created At</th>
							<th>Updated At</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{data &&
							data.data.map((admin) => (
								<tr key={admin.email}>
									<td>{admin.email}</td>
									<td>{new Date(admin.createdAt).toLocaleString()}</td>
									<td>{new Date(admin.updatedAt).toLocaleString()}</td>
									<td>
										<button
											className="btn"
											onClick={() => deleteAdmin(admin.email)}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
