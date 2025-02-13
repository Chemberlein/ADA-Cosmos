import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Manrope } from "next/font/google";
import { dark } from "@clerk/themes";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ADA Ecosystem Mapper",
	description: "graphs of the Cardano ecosystem",
	generator: "ADA Ecosystem Mapper",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: [dark],
			}}
		>
			<html lang="en">
				<body className={`${manrope.className}`}>{children}</body>
			</html>
		</ClerkProvider>
	);
}
