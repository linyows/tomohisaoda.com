import { Buffer } from "node:buffer";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import React from "react";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";
import twemoji from "twemoji";
import OgImage from "../components/ogimage";

const notosansBold = readFileSync("./app/fonts/NotoSansJP-Black.woff");
const notosansRegular = readFileSync("./app/fonts/NotoSansJP-Regular.woff");

// Inline the images as data URIs. Fetching them over the network made every
// build depend on a third party, and satori hangs when that fetch misbehaves.
const toDataUrl = (path: string): string =>
  `data:image/png;base64,${readFileSync(path).toString("base64")}`;

const backgroundUrl = toDataUrl("./public/ogibg.png");
const iconUrl = toDataUrl("./public/avatar.png");

const getIconUrl = (s: string): string => {
  const codePoint = twemoji.convert.toCodePoint(s);
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoint.split("-")[0]}.svg`;
};

export const MakeOgImage = async (
  title: string,
  id: string,
): Promise<string> => {
  const src = `ogimages/${id}.png`;
  const path = `public/${src}`;

  if (existsSync(path)) {
    return src;
  }

  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Sans JP",
        data: notosansRegular,
        weight: 400,
      },
      {
        name: "Noto Sans JP",
        data: notosansBold,
        weight: 900,
      },
    ],
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === "emoji") {
        return getIconUrl(segment);
      }
      return code;
    },
  };

  const svg = await satori(
    React.createElement(OgImage, { title, backgroundUrl, iconUrl }),
    options,
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  writeFileSync(path, png);
  console.log(`saved ogimage -- path: ${path}`);
  return src;
};
