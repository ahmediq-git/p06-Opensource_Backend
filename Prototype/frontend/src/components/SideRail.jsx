import { Database, BarChart3, Settings, Code2 } from "lucide-react";

export default function SideRail() {
	return (
		<aside className="sidebar h-full justify-start w-24">
			<section className="sidebar-title items-center p-4 gap-2">
				{/* <Code2 /> */}
				<div className="flex flex-col">
					<span>EzBase</span>
				</div>
			</section>
			<section className="sidebar-content h-fit min-h-[20rem] overflow-visible mt-4">
				<nav className="menu rounded-md">
					<section className="menu-section px-4">
						<ul className="menu-items gap-4">
							<li className="menu-item">
								<Database />
							</li>

							<li className="menu-item menu-active">
								<BarChart3 />
							</li>
							<li className="menu-item">
								<Settings />
							</li>
						</ul>
					</section>
				</nav>
			</section>
			<section className="sidebar-footer h-full justify-end bg-gray-2 pt-2">
				<div className="divider my-0"></div>
				<div className="flex items-center justify-center  p-4">
					<div className="avatar avatar-md">
						<img src="/doge.jpeg" alt="avatar" className="h-20 w-32" />
					</div>
				</div>
			</section>
		</aside>
	);
}
