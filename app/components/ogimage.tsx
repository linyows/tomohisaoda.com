import type { CSSProperties, FC } from "react";

type Props = {
  title: string;
  backgroundUrl: string;
  iconUrl: string;
};

const baseDivStyle: CSSProperties = {
  display: "flex",
  color: "#fff",
  backgroundColor: "#3d3d3d",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0 0",
  width: "100%",
  height: "100%",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  fontWeight: "bold",
};
const iconStyle = {
  marginRight: "24px",
  borderRadius: 128,
  verticalAlign: "middle",
};
const nameStyle = {
  marginTop: "20px",
  marginRight: "30px",
  fontSize: 50,
};

const titleStyle: CSSProperties = {
  fontSize: 50,
  width: "80%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const footerIconStyle = {
  marginRight: "20px",
  borderRadius: 128,
  verticalAlign: "middle",
};
const footerStyle = {
  marginTop: "16px",
  fontSize: 26,
};
const footerNameStyle = {
  marginTop: "14px",
};
const footerUrlStyle = {
  marginTop: "14px",
  marginLeft: "10px",
  fontWeight: "normal",
};

const OgImage: FC<Props> = ({ title, backgroundUrl, iconUrl }) => {
  const name = `Tomohisa Oda`;
  const url = `https://tomohisaoda.com`;
  const divStyle: CSSProperties = {
    ...baseDivStyle,
    backgroundImage: `url(${backgroundUrl})`,
  };

  if (title === "") {
    return (
      <div style={divStyle}>
        <img
          width={200}
          height={200}
          style={iconStyle}
          src={iconUrl}
          alt="icon"
        />
        <p style={nameStyle}>{name}</p>
      </div>
    );
  }

  return (
    <div style={divStyle}>
      <p style={titleStyle}>{title}</p>
      <p style={footerStyle}>
        <img
          width={70}
          height={70}
          style={footerIconStyle}
          src={iconUrl}
          alt="icon"
        />
        <span style={footerNameStyle}>{name}</span>
        <span style={footerUrlStyle}> - {url}</span>
      </p>
    </div>
  );
};

export default OgImage;
