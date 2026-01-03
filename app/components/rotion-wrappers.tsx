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
  UsePagination,
} from "rotion/ui";

export type { FetchDatabaseRes, ListBlockChildrenResponseEx };

// Next.js Link as Rotion's ClientLink
export const ClientLink = createClientLink(Link) as RotionLink;

// Wrapper components with ClientLink as default
export const List = (props: ComponentProps<typeof RotionList>) => {
  props.options = {
    ...props.options,
    link: ClientLink,
  };
  return <RotionList {...props} />;
};

export const Page = (props: ComponentProps<typeof RotionPage>) => {
  return <RotionPage {...props} link={ClientLink} />;
};

export const Table = (props: ComponentProps<typeof RotionTable>) => {
  props.options = {
    ...props.options,
    link: ClientLink,
  };
  return <RotionTable {...props} />;
};

export { UsePagination };
