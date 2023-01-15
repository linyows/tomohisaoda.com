
import satori from 'satori'
import twemoji from 'twemoji'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const notosansBold = readFileSync('./src/fonts/NotoSansJP-Black.otf')
const notosansRegular = readFileSync('./src/fonts/NotoSansJP-Regular.otf')

const getIconUrl = (s: string): string => {
  const codePoint = twemoji.convert.toCodePoint(s)
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoint.split('-')[0]}.svg`
}

export const MakeOgImage = async (title: string, id: string): Promise<string> => {
  const src = `ogimages/${id}.svg`
  const path = `public/${src}`

  if (existsSync(path)) {
    return src
  }

  const svg = await satori(
    (
      <div style={{
        display: 'flex',
        color: '#fff',
        background: '#3d3d3d',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontWeight: 'bold',
      }} >
        {title === '' && <p style={{
          fontSize: 40,
        }} >
          <img width="100" height="100" style={{
            marginRight: '24px',
            borderRadius: 128,
            verticalAlign: 'middle',
          }} src={`https://github.com/linyows.png`} alt="tomohisaoda" />
          <span style={{ marginTop: '20px' }} > Tomohisa Oda </span>
        </p>}

        {title !== '' && <p style={{
          fontSize: 40,
          width: '80%',
        }} > {title} </p>}
        {title !== '' && <p style={{
          marginTop: '20px',
          fontSize: 20,
        }} >
          <img width="50" height="50" style={{
            marginRight: '20px',
            borderRadius: 128,
            verticalAlign: 'middle',
          }} src={`https://github.com/linyows.png`} alt="tomohisaoda" />
          <span style={{ marginTop: '10px' }} > Tomohisa Oda </span>
        </p>}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: notosansRegular,
          weight: 400,
        },
        {
          name: 'Noto Sans JP',
          data: notosansBold,
          weight: 900,
        },
      ],
      loadAdditionalAsset: async (code: string, segment: string) => {
        if (code === 'emoji') {
          return getIconUrl(segment)
        }
        return code
      },
    },
  )

  writeFileSync(path, svg)
  console.log(`saved ${path}`)
  return src
}