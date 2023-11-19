import Collections from "./components/Collections";
import SideRail from "./components/SideRail";
import Documents from "./components/Documents";
import Document from "./components/Document";
import { selectionAtom } from "./lib/state/selection";
import { useAtom } from "jotai";

function App() {
  const [selection, setSelection] = useAtom(selectionAtom);
	return (
		<div className="flex bg-neutral-900 text-gray-50 h-screen max-h-screen overflow-y-scroll">
			<SideRail />
			<div className="w-[1px] h-screen bg-gray-100 opacity-10"></div>
			<Collections />

			<div className="basis-full flex flex-col p-4 ">
				{/* info bar */}
				<div className="p-4 text-2xl gap-2 flex items-center">
          <span className="text-gray-100 text-opacity-25">Collections /</span>
          <span className="">{selection.collection}</span>
        </div>

        <div className="divider divider-horizontal m-0"></div>

				<div className="basis-full flex gap-2 max-h-screen overflow-y-scroll w-full">
					{/* all docs for the collection */}
					<Documents />

          <div className="w-[1px] h-screen bg-gray-100 opacity-10"></div>

					{/* selected document */}
          <Document/>
				</div>
			</div>
		</div>
	);
}

export default App;
