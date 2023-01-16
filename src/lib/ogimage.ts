import satori, { SatoriOptions } from 'satori'
import twemoji from 'twemoji'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import OgImage from '../../components/ogimage'
import { Buffer } from 'buffer'
import sharp from 'sharp'

const notosansBold = readFileSync('./src/fonts/NotoSansJP-Black.woff')
const notosansRegular = readFileSync('./src/fonts/NotoSansJP-Regular.woff')

const getIconUrl = (s: string): string => {
  const codePoint = twemoji.convert.toCodePoint(s)
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoint.split('-')[0]}.svg`
}

export const MakeOgImage = async (title: string, id: string): Promise<string> => {
  const src = `ogimages/${id}.png`
  const path = `public/${src}`

  if (process.env.NODE_ENV !== 'development' && existsSync(path)) {
    return src
  }

  const options: SatoriOptions = {
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
  }

  const svg = await satori(OgImage({ title }), options)
  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  writeFileSync(path, png)
  console.log(`saved ogimage -- path: ${path}`)
  return src
}