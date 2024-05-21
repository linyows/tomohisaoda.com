import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import {
  FetchDatabase,
  FetchDatabaseRes,
  QueryDatabaseParameters,
} from 'rotion'
import { Table } from 'rotion/ui'
import { Chart, registerables, ChartData } from 'chart.js'
import { Line } from 'react-chartjs-2'

import Hed from '../components/hed'
import GenFeed from '../src/lib/feed'
import { MakeOgImage } from '../src/lib/ogimage'
import { MakeData } from '../src/lib/workout'
import Styles from '../styles/Workout.module.css'

Chart.register(...registerables)

const title = 'Workout'
const desc = 'Exercise is mother nature’s magic pill'

type Props = {
  ogimage: string
  latest: FetchDatabaseRes
  upperBody: ChartData<'line'>
  lowerBody: ChartData<'line'>
  abs: ChartData<'line'>
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const latest = await FetchDatabase({
    database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
    sorts: [ { property: 'Date', direction: 'descending' }, ],
    page_size: 10,
  } as QueryDatabaseParameters)

  const upperTraining = await FetchDatabase({
    database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
    filter: { property: 'Part', select: { equals: 'Upper body' } },
    sorts: [ { property: 'Date', direction: 'ascending' }, ],
  } as QueryDatabaseParameters)

  const lowerTraining = await FetchDatabase({
    database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
    filter: { property: 'Part', select: { equals: 'Lower body' } },
    sorts: [ { property: 'Date', direction: 'ascending' }, ],
  } as QueryDatabaseParameters)

  const absTraining = await FetchDatabase({
    database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
    filter: { property: 'Part', select: { equals: 'Abdominal' } },
    sorts: [ { property: 'Date', direction: 'ascending' }, ],
  } as QueryDatabaseParameters)

  await GenFeed()
  const ogimage = await MakeOgImage(`${title}: ${desc}`, `weight-training`)

  return {
    props: {
      ogimage,
      latest,
      upperBody: MakeData(upperTraining),
      lowerBody: MakeData(lowerTraining),
      abs: MakeData(absTraining),
    },
  }
}

export default function Workout ({ latest, upperBody, lowerBody, abs, ogimage }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Hed title={title} desc={desc} ogimage={ogimage} path="/weight-training" />

      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
      </header>

      <div className={Styles.workout}>
        <div className={Styles.training}>
          <span></span>
          <div>
            <h2 className={`gradation-text ${Styles.header2}`}>Latest workout log</h2>
            <p>I prioritize weight training three times a week as the most important part of my routine. However, I make sure each session lasts about an hour.</p>
            <Table keys={['Date', 'Name', 'Part', 'Weight', 'Reps', 'Sets', 'Volume']} db={latest} />
          </div>
        </div>

        <div className={Styles.training}>
          <span></span>
          <div>
            <h2 className={`gradation-text ${Styles.header2}`}>Training Volumes by Month</h2>
            <p>Here is a chart showing the total training volume for each exercise by month, calculated as the product of weight (kg), reps, and sets.</p>
            <div>
              <h3>Uppser body</h3>
              <Line data={upperBody} options={{spanGaps: true}} />
            </div>
            <div>
              <h3>Lower body</h3>
              <Line data={lowerBody} options={{spanGaps: true}} />
            </div>
            <div>
              <h3>Abdominal</h3>
              <Line data={abs} options={{spanGaps: true}} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
