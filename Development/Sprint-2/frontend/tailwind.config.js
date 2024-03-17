import ripple from "rippleui";
import forms from "@tailwindcss/forms"
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,jsx}"],
	theme: {
		extend: {},
	},
	plugins: [ripple, forms,
	function({addUtilities}){
		const newUtilities = {
			'.no-scrollbar::-webkit-scrollbar':{
				display: 'none',
			},
			'.no-scrollbar':{
				'-ms-overflow-style': 'none',
				'scrollbar-width': 'none'
			}
		}

		addUtilities(newUtilities);
	}],
	rippleui: {
		themes: [
			{
				themeName: "dark",
				colorScheme: "dark",
				colors: {
					primary: "#0487e2",
					secondary: "#0463ca",
				},
			},
		],
	},
};
