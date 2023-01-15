
import type { CSSProperties, FC, ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  title: string
}

const OgImage: FC<Props> = ({ title }) => {
  const name = `Tomohisa Oda`
  const iconSrc = `https://github.com/linyows.png`
  const divStyle: CSSProperties = {
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
  }
  const iconStyle = {
    marginRight: '24px',
    borderRadius: 128,
    verticalAlign: 'middle',
  }
  const footerIconStyle = {
    marginRight: '20px',
    borderRadius: 128,
    verticalAlign: 'middle',
  }

  if (title === '') {
    return (
      <div style={divStyle} >
        <img width="200" height="200" style={iconStyle} src={iconSrc} alt="icon" />
        <p style={{ marginTop: '20px', marginRight: '30px', fontSize: 50 }} >
          {name}
        </p>
      </div>
    )
  }

  return (
    <div style={divStyle} >
      <p style={{ fontSize: 40, width: '80%', }} >
        {title}
      </p>
      <p style={{ marginTop: '30px', fontSize: 20, }} >
        <img width="70" height="70" style={footerIconStyle} src={iconSrc} alt="icon" />
        <span style={{ marginTop: '20px' }} >
          {name}
        </span>
        <span style={{ marginTop: '20px', marginLeft: '10px', fontWeight: 'normal' }} >
          - https://tomohisaoda.com
        </span>
      </p>
    </div>
  )
}

export default OgImage