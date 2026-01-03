import {
	FetchDatabase,
	type FetchDatabaseArgs,
} from "rotion";
import GenFeed from "../../src/lib/feed";
import { MakeOgImage } from "../../src/lib/ogimage";
import { MakeData } from "../../src/lib/workout";
import WorkoutClient from "./components/workout-client";

const title = "Workout";
const desc = "Exercise is mother nature's magic pill";

export default async function Workout() {
	const latest = await FetchDatabase({
		database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
		sorts: [
			{ property: "Date", direction: "descending" },
			{ property: "Name", direction: "descending" },
		],
		page_size: 20,
	} as FetchDatabaseArgs);

	const upperTraining = await FetchDatabase({
		database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
		filter: { property: "Part", select: { equals: "Upper body" } },
		sorts: [{ property: "Date", direction: "ascending" }],
	} as FetchDatabaseArgs);

	const lowerTraining = await FetchDatabase({
		database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
		filter: {
			or: [
				{ property: "Part", select: { equals: "Lower body" } },
				{ property: "Part", select: { equals: "Abdominal" } },
			],
		},
		sorts: [{ property: "Date", direction: "ascending" }],
	} as FetchDatabaseArgs);

	await GenFeed();
	const ogimage = await MakeOgImage(`${title}: ${desc}`, `weight-training`);

	return (
		<WorkoutClient
			ogimage={ogimage}
			latest={latest}
			upperBodyW={MakeData(upperTraining, "weekly")}
			lowerBodyW={MakeData(lowerTraining, "weekly")}
			upperBodyM={MakeData(upperTraining, "monthly")}
			lowerBodyM={MakeData(lowerTraining, "monthly")}
			title={title}
			desc={desc}
		/>
	);
}
