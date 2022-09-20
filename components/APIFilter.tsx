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

import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import ProductIcon from "./ProductIcon";
import { API, Language } from "../shared/types";
import { filterHref } from "../shared/utils";

interface Props {
  api: API;
  apis: API[];
  marketplace: boolean;
  languages: Language[];
}

const APIFilter = ({ api, apis, marketplace, languages }: Props) => {
  const active = apis.includes(api);
  const apisForHref = active ? apis.filter((a) => a !== api) : [...apis, api];
  return (
    <Link
      key={api}
      href={filterHref({apis: apisForHref, languages, marketplace})}
      shallow={true}
      passHref={true}
    >
      <IconButton
        className={!active && apis.length > 0 ? "grayscale-[90%] scale-90" : "scale-125"}
        aria-label={`Toggle ${api} filter to ${active ? "off" : "on"}`}
        title={`Toggle ${api} filter to ${active ? "off" : "on"}`}
      >
        <ProductIcon name={api} />
      </IconButton>
    </Link>
  );
};

export default APIFilter;
