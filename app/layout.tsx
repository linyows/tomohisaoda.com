import "rotion/style.css";
import "../styles/globals.css";
import "normalize.css/normalize.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "./components/footer";
import GA from "./components/ga";
import Header from "./components/header";
import { notosans, notoserif } from "../src/lib/fonts";

export const metadata: Metadata = {
	alternates: {
		types: {
			"application/rss+xml": "/index.xml",
		},
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" className={`${notosans.variable} ${notoserif.variable}`}>
			<head>
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				<Suspense fallback={null}>
					<GA />
				</Suspense>

				<div className="accent"></div>

				<div className="container">
					<div>
						<Header />
					</div>

					<div className="content">{children}</div>

					<div>
						<Footer />
					</div>
				</div>
			</body>
		</html>
	);
}
