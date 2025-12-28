import { Chart, type ChartData, registerables } from "chart.js";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
	FetchDatabase,
	type FetchDatabaseArgs,
	type FetchDatabaseRes,
} from "rotion";
import { Table } from "rotion/ui";

import Hed from "../components/hed";
import GenFeed from "../src/lib/feed";
import { MakeOgImage } from "../src/lib/ogimage";
import { MakeData } from "../src/lib/workout";
import Styles from "../styles/Workout.module.css";

Chart.register(...registerables);
Chart.defaults.plugins.legend.position = "chartArea";
// Chart.defaults.animation = false

const title = "Workout";
const desc = "Exercise is mother nature’s magic pill";

type Props = {
	ogimage: string;
	latest: FetchDatabaseRes;
	upperBodyW: ChartData<"line">;
	lowerBodyW: ChartData<"line">;
	upperBodyM: ChartData<"line">;
	lowerBodyM: ChartData<"line">;
};

export const getStaticProps: GetStaticProps<Props> = async (_context) => {
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

	return {
		props: {
			ogimage,
			latest,
			upperBodyW: MakeData(upperTraining, "weekly"),
			lowerBodyW: MakeData(lowerTraining, "weekly"),
			upperBodyM: MakeData(upperTraining, "monthly"),
			lowerBodyM: MakeData(lowerTraining, "monthly"),
		},
	};
};

export default function Workout({
	latest,
	upperBodyW,
	lowerBodyW,
	upperBodyM,
	lowerBodyM,
	ogimage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const [upperbodyInterval, setUpperbodyInterval] = useState("monthly");
	const [upperbody, setUpperbody] = useState(upperBodyM);
	const showUpperbodyM = () => {
		setUpperbodyInterval("monthly");
		setUpperbody(upperBodyM);
	};
	const showUpperbodyW = () => {
		setUpperbodyInterval("weekly");
		setUpperbody(upperBodyW);
	};

	const [lowerbodyInterval, setLowerbodyInterval] = useState("monthly");
	const [lowerbody, setLowerbody] = useState(lowerBodyM);
	const showLowerbodyM = () => {
		setLowerbodyInterval("monthly");
		setLowerbody(lowerBodyM);
	};
	const showLowerbodyW = () => {
		setLowerbodyInterval("weekly");
		setLowerbody(lowerBodyW);
	};

	return (
		<>
			<Hed
				title={title}
				desc={desc}
				ogimage={ogimage}
				path="/weight-training"
			/>

			<header className="grider page-list-header">
				<span></span>
				<div>
					<h1>{title}</h1>
					<p>{desc}</p>
				</div>
			</header>

			<div className={`workout ${Styles.workout}`}>
				<div className={Styles.training}>
					<div className={Styles.pop}>
						<span className={`flat-button-light ${Styles.popInner}`}>
							Training Log
						</span>
					</div>
					<div>
						<h2 className={`gradation-text ${Styles.header2}`}>Latest 20</h2>
						<p>
							I prioritize weight training three times a week as the most
							important part of my routine. However, I make sure each session
							lasts about an hour.
						</p>
						<Table
							keys={[
								"Name",
								"Date",
								"Part",
								"Weight",
								"Reps",
								"Sets",
								"Volume",
							]}
							db={latest}
							options={{
								suffix: {
									Weight: "kg",
									Reps: "reps",
									Sets: "sets",
									Volume: "kg",
								},
							}}
						/>
					</div>
				</div>

				<div className={Styles.training}>
					<div className={Styles.pop}>
						<span className={`flat-button-light ${Styles.popInner}`}>
							Training Volumes
						</span>
					</div>
					<div>
						<h2 className={`gradation-text ${Styles.header2}`}>
							Monthly or Weekly Charts
						</h2>
						<p>
							Here is a chart showing the total training volume for each
							exercise by month, calculated as the product of weight, reps, and
							sets.
						</p>
						<div>
							<h3>Upper body</h3>
							<p>Shoulders, arms, back, chest etc.</p>
							<div className={Styles.chart}>
								<div className={Styles.chartInner}>
									<ul className={Styles.intervals}>
										<li>
											<button
												type="button"
												onClick={showUpperbodyM}
												className={
													upperbodyInterval === "monthly"
														? Styles.selected
														: undefined
												}
											>
												Monthly
											</button>
										</li>
										<li>
											<button
												type="button"
												onClick={showUpperbodyW}
												className={
													upperbodyInterval === "weekly"
														? Styles.selected
														: undefined
												}
											>
												Weekly
											</button>
										</li>
									</ul>
									<Line
										className={Styles.chart}
										data={upperbody}
										options={{ spanGaps: true }}
									/>
								</div>
							</div>
						</div>
						<div>
							<h3>Lower body</h3>
							<p>Thighs, hamstrings, abdominal, oblique, etc.</p>
							<div className={Styles.chart}>
								<div className={Styles.chartInner}>
									<ul className={Styles.intervals}>
										<li>
											<button
												type="button"
												onClick={showLowerbodyM}
												className={
													lowerbodyInterval === "monthly"
														? Styles.selected
														: undefined
												}
											>
												Monthly
											</button>
										</li>
										<li>
											<button
												type="button"
												onClick={showLowerbodyW}
												className={
													lowerbodyInterval === "weekly"
														? Styles.selected
														: undefined
												}
											>
												Weekly
											</button>
										</li>
									</ul>
									<Line
										className={Styles.chart}
										data={lowerbody}
										options={{ spanGaps: true }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
