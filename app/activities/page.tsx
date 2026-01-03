import { GetActivities } from "../lib/activity";
import { MakeOgImage } from "../lib/ogimage";
import ActivityList from "./components/activity-list";

const title = "Activities";
const desc =
	"I will write about the presentation materials and interview articles.";

export default async function ActivityIndex() {
	const pages = await GetActivities();
	const ogimage = await MakeOgImage(`${title}: ${desc}`, "activities");

	return (
		<ActivityList pages={pages} ogimage={ogimage} title={title} desc={desc} />
	);
}
