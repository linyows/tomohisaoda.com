"use client";

import { Chart, type ChartData, registerables } from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Table, type FetchDatabaseRes } from "../../components/rotion-wrappers";

import Hed from "../../components/hed";
import Styles from "../../styles/Workout.module.css";

Chart.register(...registerables);
Chart.defaults.plugins.legend.position = "chartArea";

type Props = {
	ogimage: string;
	latest: FetchDatabaseRes;
	upperBodyW: ChartData<"line">;
	lowerBodyW: ChartData<"line">;
	upperBodyM: ChartData<"line">;
	lowerBodyM: ChartData<"line">;
	title: string;
	desc: string;
};

export default function WorkoutClient({
	latest,
	upperBodyW,
	lowerBodyW,
	upperBodyM,
	lowerBodyM,
	ogimage,
	title,
	desc,
}: Props) {
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
