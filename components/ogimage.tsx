
import type { CSSProperties, FC } from 'react'

type Props = {
  title: string
}

const OgImage: FC<Props> = ({ title }) => {
  const name = `Tomohisa Oda`
  const iconSrc = `https://github.com/linyows.png`
  const divStyle: CSSProperties = {
    display: 'flex',
    color: '#fff',
    backgroundColor: '#3d3d3d',
    backgroundImage: 'url(https://raw.githubusercontent.com/linyows/tomohisaoda.com/main/public/ogibg.png)',
    backgroundRepeat:  'no-repeat',
    backgroundPosition: '0 0',
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
      <p style={{ marginTop: '16px', fontSize: 24, }} >
        <img width="70" height="70" style={footerIconStyle} src={iconSrc} alt="icon" />
        <span style={{ marginTop: '14px' }} >
          {name}
        </span>
        <span style={{ marginTop: '14px', marginLeft: '10px', fontWeight: 'normal' }} >
          - https://tomohisaoda.com
        </span>
      </p>
    </div>
  )
}

export default OgImage