"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import type { FetchDatabaseRes, ListBlockChildrenResponseEx } from "rotion";
import type { Link as RotionLink } from "rotion/ui";
import {
  List as RotionList,
  Page as RotionPage,
  Table as RotionTable,
  UsePagination,
} from "rotion/ui";

export type { FetchDatabaseRes, ListBlockChildrenResponseEx };

// Next.js Link as Rotion's ClientLink
export const ClientLink = NextLink as RotionLink;

// Wrapper components with ClientLink as default
export const List = (props: ComponentProps<typeof RotionList>) => {
  return <RotionList {...props} link={ClientLink} />;
};

export const Page = (props: ComponentProps<typeof RotionPage>) => {
  return <RotionPage {...props} link={ClientLink} />;
};

export const Table = (props: ComponentProps<typeof RotionTable>) => {
  return <RotionTable {...props} link={ClientLink} />;
};

export { UsePagination };
