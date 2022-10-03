import path from "path";
import fs from "fs/promises";
import { parseArrayOrString } from "./utils";
import { execa } from "execa";

const directory = path.join("data", "awesome");

const getAddedDate = async (file: string) => {
  const { stdout } = await execa("git", [
    "log",
    "--diff-filter=A",
    "--follow",
    "--format=%aI",
    "-1",
    "--",
    path.join(directory, file),
  ]);

  return stdout;
};

export const getEntries = async () => {
  // list all files in directory
  const files = await fs.readdir(directory);

  return Promise.all(
    files.map(async (file) =>
      fs
        .readFile(path.join(directory, file), "utf-8")
        .then(JSON.parse)
        .then(async (entry) => ({
          ...entry,
          languages: parseArrayOrString(entry.languages),
          apis: parseArrayOrString(entry.apis),
          added: await getAddedDate(file),
        }))
    )
  );
};
