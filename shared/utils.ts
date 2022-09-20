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

import { API, Language, reverseLanguage } from "./types";

export const filterHref = ({
  apis = [],
  languages = [],
  marketplace = false,
}: {
  apis?: API[];
  languages?: Language[];
  marketplace?: boolean;
}): string => {
  const params = new URLSearchParams([
    ...apis.map((api) => ["apis", api]),
    ...languages.map((language) => ["languages", reverseLanguage(language)]),
  ]);

  if (marketplace) {
    params.append("marketplace", String(marketplace));
  }

  return `/?${params.toString()}`;
};
