import { cdate } from 'cdate'
import {
  DateResponse,
  RichTextItemResponse,
  DBPageBase,
  FetchDatabaseRes,
} from 'rotion'

interface TrainingDB extends DBPageBase {
  properties: {
    Date: {
      type: 'date'
      date: DateResponse | null
    }
    Name: {
      type: 'title'
      title: RichTextItemResponse[]
    }
    Volume: {
      type: 'formula'
      formula: {
        type: 'number'
        number: number | null
      }
    }
  }
}

type Month = string
type Menuname = string

function getRandomBlue() {
  // 100-255
  const r = Math.floor(100 + Math.random() * 156)
  // 0-155
  const g = Math.floor(Math.random() * 156)
  // 100-255
  const b = Math.floor(200 + Math.random() * 56)
  return `rgba(${r}, ${g}, ${b}, 0.7)`
}

export function MakeData (db: FetchDatabaseRes) {
  let dataByMonth: {[key: Month]: {[key: Menuname]: number} } = {}
  let trainingNames: Menuname[] = []

  for (const v of db.results) {
    const db = v as unknown as TrainingDB
    const { Date, Name, Volume } = db.properties
    const d = Date.date?.start
    if (!d) {
      console.log('date is empty: ', d)
      continue
    }
    const n = Name.title.map(t => t.plain_text).join('')
    const vol = Volume.formula.number || 0

    trainingNames.push(n)
    const m = cdate(d).startOf('month').format('YYYY-MM')

    if (dataByMonth[m] && dataByMonth[m][n]) {
      dataByMonth[m][n] = dataByMonth[m][n] + vol
    } else if (dataByMonth[m]) {
      dataByMonth[m][n] = vol
    } else {
      dataByMonth[m] = {}
      dataByMonth[m][n] = vol
    }
  }

  trainingNames = Array.from(new Set(trainingNames))
  const xLabels = Object.keys(dataByMonth)

  const datasets = trainingNames.map(name => {
    const color = getRandomBlue()
    return {
      label: name,
      data: xLabels.map(date => dataByMonth[date][name] || null),
      borderColor: color,
      backgroundColor: color,
      color,
    }
  })

  return {
    labels: xLabels,
    datasets,
  }
}
