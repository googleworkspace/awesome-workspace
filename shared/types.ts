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

export interface IEntry {
  github: string; // owner/repo
  apis: API[];
  languages: Language[];
  marketplace?: string;
  added: string;
}

export enum API {
  admin = "admin",
  apps_script = "apps_script",
  calendar = "calendar",
  chat = "chat",
  classroom = "classroom",
  cloud_identity = "cloud_identity",
  contacts = "contacts",
  docs = "docs",
  drive = "drive",
  forms = "forms",
  gmail = "gmail",
  cloud_search = "cloud_search",
  groups = "groups",
  keep = "keep",
  sheets = "sheets",
  slides = "slides",
  tasks = "tasks",
  vault = "vault",
}

export enum Language {
  "c_or_cplusplus" = "C/C++",
  "c_sharp" = "C#",
  "go" = "Go",
  "html" = "HTML",
  "java" = "Java",
  "javascript" = "JavaScript",
  "kotlin" = "Kotlin",
  "php" = "PHP",
  "python" = "Python",
  "objective_c" = "Objective-C",
  "ruby" = "Ruby",
  "rust" = "Rust",
  "shell" = "Shell",
  "swift" = "Swift",
  "other" = "Other",
}

export const reverseLanguage = (value: Language): keyof typeof Language => {
  return (
    (Object.keys(Language) as Array<keyof typeof Language>).find(
      (key) => Language[key] === value
    ) ?? "other"
  );
};
