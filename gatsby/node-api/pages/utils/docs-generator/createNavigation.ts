import { populateObject } from "./helpers";
import {
  DocsNavigation,
  ManifestItem,
  ManifestSpec,
  NewManifest,
} from "./types";

export const createNavigation = (manifestSpec: NewManifest): DocsNavigation => {
  const navigation: DocsNavigation = manifestSpec;

  // working on reference
  Object.keys(manifestSpec).map(key => {
    manifestSpec[key] = populateObject<ManifestItem>(manifestSpec[key]);
  });

  return navigation;
};
