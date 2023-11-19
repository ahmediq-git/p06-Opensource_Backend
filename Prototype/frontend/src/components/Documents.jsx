import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useAtom } from "jotai";
import { selectionAtom } from "../lib/state/selection";
import useSwr from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Documents() {
	const [selection, setSelection] = useAtom(selectionAtom);

	const { data, error } = useSwr(
		`http://0.0.0.0:3690/get_all_docs/${selection.collection}`,
		fetcher
	);

	useEffect(() => {
		console.log("data", data);
		console.log("error", error);
	}, [data, error]);

	const setDocumentSelected = (doc) => {
		setSelection((prev) => ({ ...prev, document: doc }));
	};
	return (
		<div className="basis-1/4 w-full p-4 rounded-sm gap-4 flex flex-col max-h-screen overflow-y-scroll">
			<p>Documents</p>

			<nav className="menu  p-2 rounded-md">
				<section className="menu-section">
					<ul className="menu-items gap-2">
						{data?.length &&
							data?.map((doc) => (
								<li
									key={doc._id.$oid}
									className={`menu-item ${
										selection?.document?._id?.$oid === doc._id.$oid ? "menu-active" : null
									} bg-gray-2 flex justify-between`}
									onClick={() => setDocumentSelected(doc)}
								>
									<p>{doc._id.$oid}</p>
									<ArrowRight />
								</li>
							))}
					</ul>
				</section>
			</nav>
		</div>
	);
}
