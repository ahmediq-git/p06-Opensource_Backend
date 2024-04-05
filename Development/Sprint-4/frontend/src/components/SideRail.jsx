import { useAtom } from "jotai";
import { Database, BarChart3, Settings, Code2, Zap, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { adminAtom } from "../lib/state/adminAtom";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { Waypoints } from "lucide-react";
import {Folder} from "lucide-react";

export default function SideRail() {
	const [active, setActive] = useState("");
	const [admin, setAdmin] = useAtom(adminAtom)
	const navigate = useNavigate();

	useEffect(() => {
		switch (location.pathname) {
			case "/":
				setActive("database");
				break;
			case "/logs":
				setActive("logs");
				break;
			case "/settings":
				setActive("settings");
				break;
			case "realtimedemo":
				setActive("realtimedemo");
				break;
			case "functions":
				setActive("functions");
				break;
			case "stress":
				setActive("stress");
				break;
			case "schema":
				setActive("schema");
				break;
			case "files":
				setActive("files");
				break;
			default:
				setActive("");
		}
	}, [location.pathname]);

	const signOut = async () => {
		setAdmin('jwt', '');
		navigate("/login");
	}

	return (
		<aside className="sidebar h-full justify-start w-24 bg-gray-1">
			<section className="sidebar-title items-center p-4 gap-2">
				{/* <Code2 /> */}
				<div className="flex flex-col">
					<span>EzBase</span>
				</div>
			</section>
			<section className="sidebar-content h-full min-h-[20rem] overflow-visible mt-4">
				<nav className="menu rounded-md">
					<section className="menu-section px-4">
						<ul className="menu-items gap-4">
							<li
								onClick={() => { setActive("database"); navigate("/") }}
								className={`menu-item ${active === "database" && "menu-active"
									}`}
							>
								<Database />
							</li>

							<li
								onClick={() => { setActive("logs"); navigate("/logs") }}
								className={`menu-item ${active === "logs" && "menu-active"}`}
							>
								<BarChart3 />
							</li>
							<li
								onClick={() => { setActive("schema"); navigate("/schema") }}
								className={`menu-item ${active === "schema" && "schema"
									}`}
							>
								<Waypoints />
							</li>
							<li
								onClick={() => { setActive("files"); navigate("/files") }}
								className={`menu-item ${active === "files" && "menu-active"
									}`}
							>
								<Folder />
							</li>
							<li
								onClick={() => { setActive("settings"); navigate("/settings") }}
								className={`menu-item ${active === "settings" && "menu-active"
									}`}
							>
								<Settings />
							</li>
							<li
								onClick={() => { setActive("realtimedemo"); navigate("/rt") }}
								className={`menu-item ${active === "realtimedemo" && "menu-active"
									}`}
							>
								<Zap />
							</li>
							<li
								onClick={() => { setActive("functions"); navigate("/functions") }}
								className={`menu-item ${active === "functions" && "menu-active"
									}`}
							>
								<Play />
							</li>
							<li
								onClick={() => { setActive("stress"); navigate("/stress") }}
								className={`menu-item ${active === "stress" && "menu-active"
									}`}
							>
								<Flame />
							</li>
						</ul>
					</section>
				</nav>
			</section>

			<section className="sidebar-footer h-80 justify-end bg-gray-1 pt-2 z-20">
				<div className="divider my-0"></div>
				<div className="dropdown w-full cursor-pointer  p-4">
					<label className="flex items-center justify-center w-full" tabindex="0">
						<div className="avatar avatar-md cursor-pointer">
							<img src="/doge.jpeg" alt="avatar" className="h-20 w-32" />
						</div>
					</label>

					<div className="dropdown-menu dropdown-menu-top-right">

						<a tabindex="-1" className="dropdown-item text-sm"
							onClick={signOut}>
							Sign out
						</a>
					</div>
				</div>
			</section>
		</aside>
	);
}
