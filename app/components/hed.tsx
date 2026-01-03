import type { FC, ReactNode } from "react";

type Props = {
  title?: string;
  desc?: string;
  ogimage?: string;
  path?: string;
  children?: ReactNode;
};

// Note: In App Router, metadata should be exported from page.tsx
// This component is kept for compatibility with client components
const Hed: FC<Props> = () => {
  return null;
};

export default Hed;
