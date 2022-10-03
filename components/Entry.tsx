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

import Link from "next/link";
import ProductIcon from "./ProductIcon";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { filterHref } from "../shared/utils";
import { IEntry } from "../shared/types";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import { LanguageColorContext } from "../shared/context";
import LinkButton from "./LinkButton";

const Entry = ({ github, marketplace, apis, languages }: IEntry) => {
  const languageButtons = languages.map((language) => (
    <div key={language}>
      <LanguageColorContext.Consumer>
        {(colors) => (
          <LinkButton
            href={filterHref({
              apis: [],
              languages: [language],
              marketplace: false,
            })}
            variant="text"
            style={{
              borderBottom: `2px solid ${colors[language]}`,
              borderRadius: 0,
              padding: "2px",
            }}
            shallow={true}
            aria-label={`Show projects using ${language}`}
            tabIndex={-1}
          >
            {language}
          </LinkButton>
        )}
      </LanguageColorContext.Consumer>
    </div>
  ));

  const apiButtons = apis.map((api) => (
    <Link
      key={api}
      title={api}
      href={filterHref({
        apis: [api],
        languages: [],
        marketplace: false,
      })}
      shallow={true}
      passHref={true}
    >
      <IconButton aria-label={`Show projects using ${api}`} tabIndex={-1}>
        <ProductIcon name={api} />
      </IconButton>
    </Link>
  ));
  return (
    <Card
      variant="elevation"
      className={"lg:max-w-sm"}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <a href={`https://github.com/${github}`}>
        <CardMedia
          component="img"
          image={`https://opengraph.githubassets.com/1/${github}`}
          alt={`Image for repository ${github}`}
        />
      </a>
      <CardContent className="border-t-grey-200 border-t">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm">APIs:</span>
          {apiButtons}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm">Languages:</span>
          {languageButtons}
        </div>
      </CardContent>
      <div className={"flex-grow"} />
      <CardActions className="border-t-grey-200 border-t">
        <Button
          href={`https://github.com/${github}`}
          title="View source"
          variant="text"
          startIcon={<GitHubIcon />}
        >
          Source
        </Button>
        {marketplace ? (
          <Button
            href={marketplace}
            title="View Marketplace Listing"
            variant="text"
            startIcon={<GoogleIcon />}
          >
            Marketplace
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
};

export default Entry;
