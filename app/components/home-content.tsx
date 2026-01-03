"use client";

import Image from "next/image";
import Link from "next/link";
import type { PageObjectResponseEx } from "rotion";
import Styles from "../styles/Home.module.css";
import {
  type FetchDatabaseRes,
  List,
  type ListBlockChildrenResponseEx,
  Page,
} from "./rotion-wrappers";

type Props = {
  aboutPage: PageObjectResponseEx;
  about: ListBlockChildrenResponseEx;
  project: FetchDatabaseRes;
  blog: FetchDatabaseRes;
  activity: FetchDatabaseRes;
  workout: FetchDatabaseRes;
};

export default function HomeContent({
  aboutPage,
  about,
  project,
  blog,
  activity,
  workout,
}: Props) {
  const getIconUrl = () => {
    if (!aboutPage.icon) return "";
    if ("src" in aboutPage.icon) return aboutPage.icon.src;
    return "";
  };

  return (
    <>
      <section className={`${Styles.section} ${Styles.about} grider`}>
        <div className={Styles.portrait}>
          <Image
            className={Styles.icon}
            src={getIconUrl()}
            alt="tomohisaoda"
            width={160}
            height={160}
          />
        </div>
        <div className={Styles.aboutBody}>
          <Page blocks={about} />
          <div className={Styles.aboutFooter}>
            <Link className={`flat-button ${Styles.toContact}`} href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}>
          <span className="neumorphism-h">Projects</span>
        </h2>
        <div className={`${Styles.recent} recent-project`}>
          <List
            keys={["Name", "Description", "dashed", "URL", "Tags", "Date"]}
            db={project}
            options={{
              href: { Name: "/projects/[Slug]" },
            }}
          />
          <p className={Styles.viewall}>
            <Link
              className={`flat-button ${Styles.viewallButton}`}
              href="/projects"
            >
              View all
            </Link>
          </p>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}>
          <span className="neumorphism-h">Blog</span>
        </h2>
        <div className={Styles.recent}>
          <List
            keys={["Name", "dashed", "Tags", "Date"]}
            db={blog}
            options={{
              href: { Name: "/blog/[Slug]" },
            }}
          />
          <p className={Styles.viewall}>
            <Link
              className={`flat-button ${Styles.viewallButton}`}
              href="/blog"
            >
              View all
            </Link>
          </p>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}>
          <span className="neumorphism-h">Activities</span>
        </h2>
        <div className={Styles.recent}>
          <List
            keys={["Name", "dashed", "URL", "Tags", "Date"]}
            db={activity}
            options={{
              href: { Name: "/activities/[id]" },
            }}
          />
          <p className={Styles.viewall}>
            <Link
              className={`flat-button ${Styles.viewallButton}`}
              href="/activities"
            >
              View all
            </Link>
          </p>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}>
          <span className="neumorphism-h">Workout</span>
        </h2>
        <div className={Styles.recent}>
          <List
            keys={[
              "Name",
              "dashed",
              "Weight",
              "Reps",
              "Sets",
              "Volume",
              "Date",
            ]}
            db={workout}
            options={{
              suffix: {
                Weight: "kg",
                Reps: "reps",
                Sets: "sets",
                Volume: "kg",
              },
            }}
          />
          <p className={Styles.viewall}>
            <Link
              className={`flat-button ${Styles.viewallButton}`}
              href="/workout"
            >
              View all
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
