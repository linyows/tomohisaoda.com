import { cdate } from "cdate";
import type {
  DateResponse,
  DBPageBase,
  FetchDatabaseRes,
  RichTextItemResponse,
} from "rotion";

interface TrainingDB extends DBPageBase {
  properties: {
    Date: {
      type: "date";
      date: DateResponse | null;
    };
    Name: {
      type: "title";
      title: RichTextItemResponse[];
    };
    Volume: {
      type: "formula";
      formula: {
        type: "number";
        number: number | null;
      };
    };
  };
}

type Month = string;
type Menuname = string;

// Earth tones that stay readable on both the sage light background and the
// wine red dark background
const chartColors = [
  "#8a7c2e",
  "#b5654a",
  "#4f7a63",
  "#a8894c",
  "#8c4a52",
  "#3f6b7a",
  "#c08a3e",
  "#5f7d3a",
];

function getColor(index: number) {
  return chartColors[index % chartColors.length];
}

export function MakeData(
  db: FetchDatabaseRes,
  intervals: "weekly" | "monthly" = "monthly",
) {
  const dataByMonth: { [key: Month]: { [key: Menuname]: number } } = {};
  let trainingNames: Menuname[] = [];

  for (const v of db.results) {
    const db = v as unknown as TrainingDB;
    const { Date: dateProperty, Name, Volume } = db.properties;
    const d = dateProperty.date?.start;
    if (!d) {
      continue;
    }
    const n = Name.title.map((t) => t.plain_text).join("");
    const vol = Volume.formula.number || 0;

    trainingNames.push(n);
    const m =
      intervals === "monthly"
        ? cdate(d).startOf("month").format("YYYY-MM")
        : cdate(d).startOf("week").format("YYYY-MM-DD");

    if (dataByMonth[m]?.[n]) {
      dataByMonth[m][n] = dataByMonth[m][n] + vol;
    } else if (dataByMonth[m]) {
      dataByMonth[m][n] = vol;
    } else {
      dataByMonth[m] = {};
      dataByMonth[m][n] = vol;
    }
  }

  trainingNames = Array.from(new Set(trainingNames));
  const xLabels = Object.keys(dataByMonth);

  const datasets = trainingNames.map((name, i) => {
    const color = getColor(i);
    return {
      label: name,
      data: xLabels.map((date) => dataByMonth[date][name] || null),
      borderColor: color,
      backgroundColor: color,
      color,
    };
  });

  return {
    labels: xLabels,
    datasets,
  };
}
