import { ArrowRight } from "lucide-react";
import { useAtom } from "jotai";
import { selectionAtom } from "../lib/state/selection";
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

export default function Documents() {
	const [selection, setSelection] = useAtom(selectionAtom);


	return (
		<div className="basis-1/4 w-full p-4 rounded-sm gap-4 flex flex-col max-h-screen overflow-y-scroll">
			<p>Document</p>

            <div>
                <div className="flex justify-between items-center">
                    <JSONPretty id="doc" data={selection.document}></JSONPretty>
                </div>

            </div>
		</div>
	);
}
