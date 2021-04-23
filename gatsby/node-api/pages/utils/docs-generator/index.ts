import { ContentLoader } from "./contentLoader";
import { extractContent } from "./extractContent";
import { loadManifest } from "./loadManifest";
import { ContentGQL, DocsContentDocs } from "./types";

const contentLoader = new ContentLoader();

export const docsGenerator = <T extends ContentGQL>(
  docs: T[],
  folder: string,
  extractFn: (
    doc: T,
    docsGroup: string,
    topicId: string,
  ) => DocsContentDocs | null,
  version?: string,
) => {
  contentLoader.setFolder(folder);
  contentLoader.setVersion(version ? version : "");

  const manifestSpec = loadManifest(contentLoader.loadManifest());
  // const navigation = createNavigation(manifestSpec);
  const content = extractContent<T>(
    manifestSpec,
    docs,
    contentLoader,
    extractFn,
    "",
  );

  return {
    content,
    navigation: manifestSpec,
    manifest: manifestSpec,
  };
};

export type DocsGeneratorReturnType = ReturnType<typeof docsGenerator>;
