"use client";

/**
 * Document:
 * https://nextjs.org/docs/messages/next-script-for-ga
 * Example:
 * https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics
 */

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import type React from "react";
import { useEffect } from "react";

type GtagCommand = "config" | "event" | "set" | "js";

declare global {
	interface Window {
		gtag: (command: GtagCommand, ...args: unknown[]) => void;
	}
}

const GAID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
	window.gtag("config", GAID, {
		page_path: url,
	});
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export type EventProps = {
	action: string;
	category: string;
	label: string;
	value: number;
};
export const event = ({ action, category, label, value }: EventProps) => {
	window.gtag("event", action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};

const GA: React.FC = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url =
			pathname +
			(searchParams?.toString() ? `?${searchParams.toString()}` : "");
		pageview(url);
	}, [pathname, searchParams]);

	return (
		<>
			{/* Global site tag (gtag.js) - Google Analytics */}
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GAID}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GAID}');
        `}
			</Script>
		</>
	);
};

export default GA;
