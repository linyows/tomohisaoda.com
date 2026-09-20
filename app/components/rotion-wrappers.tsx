"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import type { FetchDatabaseRes, ListBlockChildrenResponseEx } from "rotion";
import type { Link as RotionLink } from "rotion/ui";
import {
  createClientLink,
  List as RotionList,
  Page as RotionPage,
  Table as RotionTable,
  usePagination,
} from "rotion/ui";

export type { FetchDatabaseRes, ListBlockChildrenResponseEx };

// Next.js Link as Rotion's ClientLink
export const ClientLink = createClientLink(Link) as RotionLink;

// Wrapper components with ClientLink as default
export const List = (props: ComponentProps<typeof RotionList>) => {
  const options = { ...props.options, link: ClientLink };
  return <RotionList {...props} options={options} />;
};

export const Page = (props: ComponentProps<typeof RotionPage>) => {
  return <RotionPage {...props} link={ClientLink} />;
};

export const Table = (props: ComponentProps<typeof RotionTable>) => {
  const options = { ...props.options, link: ClientLink };
  return <RotionTable {...props} options={options} />;
};

export { usePagination };
