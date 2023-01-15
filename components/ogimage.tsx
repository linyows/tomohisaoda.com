
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
        <p style={{ fontSize: 40 }} >
          <img width="100" height="100" style={iconStyle} src={iconSrc} alt="icon" />
          <span style={{ marginTop: '20px' }} > 
            {name}
          </span>
        </p>
      </div>
    )
  }

  return (
    <div style={divStyle} >
      <p style={{ fontSize: 40, width: '80%', }} >
        {title}
      </p>
      <p style={{ marginTop: '20px', fontSize: 20, }} >
        <img width="50" height="50" style={footerIconStyle} src={iconSrc} alt="icon" />
        <span style={{ marginTop: '10px' }} >
          {name}
        </span>
      </p>
    </div>
  )
}

export default OgImage