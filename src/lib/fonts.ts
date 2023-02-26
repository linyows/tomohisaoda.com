import localFont from '@next/font/local'

export const notosans = localFont({
  src: [
    {
      path: '../fonts/NotoSansJP-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/NotoSansJP-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  fallback: [
    'Noto Sans JP',
    'Montserrat',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji',
  ],
  display: 'block',
})

export const notoserif = localFont({
  src: [
    {
      path: '../fonts/NotoSerifJP-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/NotoSerifJP-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  fallback: [
    'Noto Serif JP',
    'Merriweather',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  display: 'block',
})