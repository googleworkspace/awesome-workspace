/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
} from "@mui/material";
import { API, IEntry, Language } from "../shared/types";
import {
  faPlus,
  faArrowDownShortWide,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import { filterHref } from "../shared/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getEntries } from "../shared/entries";
import { GetStaticProps } from "next";
import { LanguageColorContext } from "../shared/context";
import { NextRouter, withRouter } from "next/router";
import { useState } from "react";
import APIFilter from "../components/APIFilter";
import Entry from "../components/Entry";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LinkButton from "../components/LinkButton";
import type { NextPage } from "next";
import YAML from "yaml";

interface WithRouterProps {
  router: NextRouter;
}

interface StaticProps {
  entries: IEntry[];
  colors: { [key: string]: string };
}

type Props = WithRouterProps & StaticProps;

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const entries = await getEntries();

  // randomize entries
  const shuffledEntries = entries.sort(() => Math.random() - 0.5);

  // fetch and parse remote yaml file for GitHub language colors
  const colors = Object.fromEntries(
    Object.entries(
      YAML.parse(
        await fetch(
          "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml"
        ).then((res) => res.text())
      ) as { [key: string]: { color?: string } }
    )
      .map(([name, { color }]) => [name, color])
      .filter(
        ([name, color]) =>
          Object.values(Language).includes(name as Language) && color
      )
  );

  return {
    props: {
      entries: shuffledEntries,
      colors,
    },
  };
};

const Home: NextPage<Props> = ({ colors, entries, router }) => {
  const newIssueURL =
    "https://github.com/googleworkspace/awesome-workspace/issues/new/choose";

  const query = router.query;

  const apis = (
    query.apis
      ? typeof query.apis === "string"
        ? [query.apis]
        : query.apis
      : []
  ).map((api) => API[api as keyof typeof API]);

  const languages = (
    query.languages
      ? typeof query.languages === "string"
        ? [query.languages]
        : query.languages
      : []
  ).map((language) => Language[language as keyof typeof Language]);

  const marketplace = query.marketplace === "true";

  const allAPIs = [
    ...new Set(entries.map((entry) => entry.apis).flat()),
  ].sort();

  const allLanguages = [
    ...new Set(entries.map((entry) => entry.languages).flat()),
  ].sort();

  const filtered = entries.filter((entry) => {
    for (const api of apis) {
      if (!entry.apis.includes(api)) {
        return false;
      }
    }

    let containsLanguage = languages.length === 0;
    for (const language of languages) {
      containsLanguage = containsLanguage || entry.languages.includes(language);
    }

    if (!containsLanguage) {
      return false;
    }

    if (marketplace && !entry.marketplace) {
      return false;
    }

    return true;
  });

  const [limit, setLimit] = useState(12);
  const [sortBy, setSortBy] = useState<"github" | "random" | "added">("random");
  const [sortOrder, setSortOrder] = useState<boolean>(true);

  const sort = (a: IEntry, b: IEntry) => {
    let result = 0;
    if (sortBy === "github") {
      result = a.github.localeCompare(b.github);
    }
    if (sortBy === "added") {
      result = a.added.localeCompare(b.added);
    }

    return sortOrder ? result : -result;
  };

  const addProjectButton = (
    <Button
      className="bg-red-500"
      startIcon={<FontAwesomeIcon icon={faPlus} />}
      variant="contained"
      href={newIssueURL}
    >
      Add your project
    </Button>
  );

  return (
    <LanguageColorContext.Provider value={colors}>
      <div className="container mx-auto max-w-7xl flex flex-col min-h-screen gap-2 px-6 2xl:px-0 font-sans relative">
        <Head>
          <title>Google Workspace Awesome List</title>
          <meta
            name="description"
            content="Awesome list for Google Workspace containing Open Source projects categorized by API and Language."
          />
          <link rel="icon" href={`${router.basePath}/favicon.png`} />
        </Head>
        <a className="skip-link right-0" href="#main">
          Skip to content
        </a>

        <header className="p-2">
          <div className="mb-2 flex flex-col sm:flex-row gap-2 sm:gap-6 py-2 items-center">
            <div className="w-96 sm:w-auto flex justify-center">
              <Image
                src={`${router.basePath}/logo.svg`}
                alt="Google Workspace Logo"
                width={150}
                height={50}
              />
            </div>
            <h1 className="font-cursive text-4xl text-center">Awesome List</h1>
          </div>
          <p className="text-xl">
            Showcase your{" "}
            <a className="text-blue-700" href="https://workspace.google.com">
              Google Workspace
            </a>{" "}
            open source project.{" "}
            <span className="ml-4">{addProjectButton}</span>
          </p>
        </header>

        <nav>
          <Card variant="elevation" className="mb-8 2xl:-mx-8">
            <CardContent className="flex gap-4 flex-col">
              <h2 className="font-cursive text-2xl">
                Filter projects by API or Language
              </h2>
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-sm">APIs:</span>
                {allAPIs.map((api) => (
                  <APIFilter
                    key={api}
                    api={api as API}
                    apis={apis}
                    languages={languages}
                    marketplace={marketplace}
                  ></APIFilter>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-sm">Languages:</span>
                {allLanguages.map((language) => {
                  return (
                    <div key={language}>
                      <LanguageColorContext.Consumer>
                        {(colors) => {
                          const active = languages.includes(language);
                          const languagesForHref = active
                            ? languages.filter((a) => a !== language)
                            : [...languages, language];

                          return (
                            <LinkButton
                              key={language}
                              href={filterHref({
                                apis,
                                languages: languagesForHref,
                                marketplace,
                              })}
                              variant="contained"
                              className={"bg-blue-600 shadow-none"}
                              style={{
                                borderBottom: `8px solid ${colors[language]}`,
                                ...(!active && languages.length !== 0
                                  ? {
                                      background: `repeating-linear-gradient(-55deg, #222, #222 5px, #555 5px, #555 10px)`,
                                    }
                                  : {}),
                              }}
                              shallow={true}
                              title={`Toggle ${language} filter to ${
                                active ? "off" : "on"
                              }`}
                              aria-label={`Toggle ${language} filter to ${
                                active ? "off" : "on"
                              }`}
                            >
                              {language}
                            </LinkButton>
                          );
                        }}
                      </LanguageColorContext.Consumer>
                    </div>
                  );
                })}
              </div>
            </CardContent>

            <CardActions className="border-t-grey-200 border-t p-4">
              <label htmlFor="sortBy" className="text-sm mr-4">
                Sort:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border rounded focus:ring-blue-500 focus:border-blue-500 p-2 min-w-[15%]"
              >
                <option></option>
                <option value="added">Date Added</option>
                <option value="github">Name</option>
              </select>
              {sortBy ? (
                <IconButton
                  onClick={() => setSortOrder(!sortOrder)}
                  aria-label="Toggle sort order"
                  className="text-blue-600 mx-2"
                >
                  <FontAwesomeIcon
                    icon={
                      sortOrder ? faArrowDownShortWide : faArrowDownWideShort
                    }
                  ></FontAwesomeIcon>
                </IconButton>
              ) : null}
            </CardActions>
            {apis.length || languages.length || marketplace ? (
              <CardActions className="border-t-grey-200 border-t p-4">
                <Link href={router.pathname}>
                  <Button
                    variant="contained"
                    className="w-fit bg-red-500"
                    title="Reset filters"
                    aria-label="Reset filters"
                  >
                    Reset filters
                  </Button>
                </Link>
              </CardActions>
            ) : null}
          </Card>
        </nav>
        <main id="main">
          <div className="flex flex-wrap gap-4 mb-12">
            {filtered
              .sort(sort)
              .slice(0, limit)
              .map((entry) => (
                <Entry key={entry.github} {...entry} />
              ))}
          </div>
          <div className="flex flex-col items-center gap-4">
            {filtered.length > limit ? (
              <Button
                className="bg-blue-500"
                variant="contained"
                onClick={() => setLimit(limit + 12)}
              >
                Load more projects
              </Button>
            ) : null}

            {addProjectButton}
          </div>
        </main>

        <footer className="px-2 py-8">
          <Alert severity="info">
            Not an official Google product and projects listed here are neither
            vetted nor endorsed by Google. To submit feedback, please{" "}
            <a className="text-blue-700" href={newIssueURL}>
              open an issue
            </a>
            .
          </Alert>
        </footer>
      </div>
    </LanguageColorContext.Provider>
  );
};

export default withRouter(Home);
