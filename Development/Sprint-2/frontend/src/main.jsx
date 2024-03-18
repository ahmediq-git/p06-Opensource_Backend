import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SWRConfig } from "swr";
import { localStorageProvider } from "./lib/utils/localStorageProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<SWRConfig value={{ provider: localStorageProvider }}>
			<App></App>
		</SWRConfig>
	</React.StrictMode>
);
