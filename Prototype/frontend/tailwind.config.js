import ripple from "rippleui";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,jsx}"],
	theme: {
		extend: {},
	},
	plugins: [ripple],
	rippleui: {
		themes: [
			{
				themeName: "dark",
				colorScheme: "dark",
				colors: {
					primary: "#320064",
					secondary: "#230046",
				},
			},
		],
	},
};
