import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface PackageJson {
  name: string;
  version: string;
}

const PKG_PATH = join(dirname(fileURLToPath(import.meta.url)), "../package.json");

export const pkg: PackageJson = JSON.parse(readFileSync(PKG_PATH, "utf8")) as PackageJson;
