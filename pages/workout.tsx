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
Chart.defaults.plugins.legend.position = 'chartArea'
Chart.defaults.animation = false

const title = 'Workout'
const desc = 'Exercise is mother nature’s magic pill'

type Props = {
  ogimage: string
  latest: FetchDatabaseRes
  upperBody: ChartData<'line'>
  lowerBody: ChartData<'line'>
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const latest = await FetchDatabase({
    database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
    sorts: [ { property: 'Date', direction: 'descending' }, ],
    page_size: 20,
  } as QueryDatabaseParameters)

  const upperTraining = await FetchDatabase({
    database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
    filter: { property: 'Part', select: { equals: 'Upper body' } },
    sorts: [ { property: 'Date', direction: 'ascending' }, ],
  } as QueryDatabaseParameters)

  const lowerTraining = await FetchDatabase({
    database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
    filter: { or: [
      { property: 'Part', select: { equals: 'Lower body' } },
      { property: 'Part', select: { equals: 'Abdominal' } },
    ] },
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
    },
  }
}

export default function Workout ({ latest, upperBody, lowerBody, ogimage }: InferGetStaticPropsType<typeof getStaticProps>) {
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

      <div className={`workout ${Styles.workout}`}>
        <div className={Styles.training}>
          <div className={Styles.pop}>
            <span className={Styles.popInner}>Training Log</span>
          </div>
          <div>
            <h2 className={`gradation-text ${Styles.header2}`}>Latest 20</h2>
            <p>I prioritize weight training three times a week as the most important part of my routine. However, I make sure each session lasts about an hour.</p>
            <Table
              keys={['Name', 'Date', 'Part', 'Weight', 'Reps', 'Sets', 'Volume']}
              db={latest}
              options={ { suffix: { Weight: 'kg', Reps: 'reps', Sets: 'sets', Volume: 'kg' } } }
            />
          </div>
        </div>

        <div className={Styles.training}>
          <div className={Styles.pop}>
            <span className={Styles.popInner}>Training Volumes</span>
          </div>
          <div>
            <h2 className={`gradation-text ${Styles.header2}`}>Monthly Charts</h2>
            <p>Here is a chart showing the total training volume for each exercise by month, calculated as the product of weight, reps, and sets.</p>
            <div>
              <h3>Upper body</h3>
              <p>Shoulders, arms, back, chest etc.</p>
              <Line data={upperBody} options={{spanGaps: true}} />
            </div>
            <div>
              <h3>Lower body</h3>
              <p>Thighs, hamstrings, abdominal, oblique, etc.</p>
              <Line data={lowerBody} options={{spanGaps: true}} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
