import type { Metadata } from "next";

const defaultTitle = "Tomohisa Oda";
const defaultDesc =
  "Software Engineer, researcher, and writer, living in Fukuoka Japan.";
const defaultUrl = "https://tomohisaoda.com";

type GenerateMetadataParams = {
  title?: string;
  desc?: string;
  ogimage?: string;
  path?: string;
};

export function generatePageMetadata({
  title,
  desc,
  ogimage,
  path,
}: GenerateMetadataParams): Metadata {
  const pageTitle = title ? `${title} - ${defaultTitle}` : defaultTitle;
  const description = desc || defaultDesc;
  const url = path ? `${defaultUrl}${path}` : defaultUrl;
  const images = ogimage ? [`${defaultUrl}/${ogimage}`] : undefined;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: defaultTitle,
      type: "website",
      ...(images && {
        images: [
          {
            url: images[0],
            width: 1200,
            height: 630,
          },
        ],
      }),
    },
    twitter: {
      ...(ogimage && { card: "summary_large_image" }),
      site: "@linyows",
      title: pageTitle,
      description,
      ...(images && { images }),
    },
    alternates: {
      canonical: url,
    },
  };
}
