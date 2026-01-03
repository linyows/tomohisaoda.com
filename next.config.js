/** @type {import('next').NextConfig} */

module.exports = {
  output: "export",
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  images: {
    unoptimized: true,
  },
};
