import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";

const nunitoSans = Nunito_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-nunito-sans",
});

const idealista = localFont({
	src: [
		{
			path: "./Idealista/Idealista-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "./Idealista/Idealista-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "./Idealista/Idealista-Light.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./Idealista/Idealista-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "./Idealista/Idealista-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "./Idealista/Idealista-Thin.woff2",
			weight: "300",
			style: "normal",
		},
	],
	variable: "--font-idealista",
});

export { nunitoSans, idealista };
