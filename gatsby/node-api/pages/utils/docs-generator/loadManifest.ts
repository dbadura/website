import { safeLoad } from "js-yaml";
import { NewManifest } from "./types";

export const loadManifest = (yaml: string): NewManifest =>
  safeLoad(yaml) as NewManifest;
