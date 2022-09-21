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

import APIFilter from "../components/APIFilter";
import Entry from "../components/Entry";
import fs from "fs/promises";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import YAML from "yaml";
import { Alert, Button, Card, CardActions, CardContent } from "@mui/material";
import { API, IEntry, Language } from "../shared/types";
import { filterHref } from "../shared/utils";
import { GetStaticProps } from "next";
import { NextRouter, withRouter } from "next/router";
import { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LanguageColorContext } from "../shared/context";
import LinkButton from "../components/LinkButton";

interface WithRouterProps {
  router: NextRouter;
}

interface StaticProps {
  entries: IEntry[];
  colors: { [key: string]: string };
}

type Props = WithRouterProps & StaticProps;

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const directory = path.join("data", "awesome");
  // list all files in directory
  const files = await fs.readdir(directory);

  const entries = (
    await Promise.all(
      files.map(async (file) =>
        fs.readFile(path.join(directory, file), "utf-8").then(JSON.parse)
      )
    )
  ).map((entry: IEntry) => {
    return {
      ...entry,
      languages:
        typeof entry.languages === "string"
          ? [entry.languages]
          : entry.languages,
      apis: typeof entry.apis === "string" ? [entry.apis] : entry.apis,
    };
  });

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
            {filtered.slice(0, limit).map((entry) => (
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
