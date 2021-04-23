import { ContentLoader } from "./contentLoader";
import { extractSpecifications } from "./extractSpecifications";
import { sortDocsByOrder, sortDocsByType } from "./helpers";
import {
  BtrDocsContent,
  ContentGQL,
  DocsContentDocs,
  DocsContentItem,
  NewManifest,
} from "./types";

export const extractContent = <T extends ContentGQL>(
  manifestSpec: NewManifest,
  contentGQLs: T[],
  contentLoader: ContentLoader,
  extractFn: (
    doc: T,
    docsGroup: string,
    topicId: string,
  ) => DocsContentDocs | null,
  compoundID: string,
): BtrDocsContent => {
  const content: BtrDocsContent = {};

  const parentID = compoundID;
  Object.keys(manifestSpec).forEach((id: string) => {
    if (parentID === "") {
      compoundID = id;
    } else {
      compoundID = `${compoundID}/${id}`;
    }

    const item = manifestSpec[id];
    // create content placeholder
    content[id] = {
      items: {},
      topic: {} as DocsContentItem,
    };

    const docsConfig = contentLoader.loadTopicConfig(id);

    const topicSpecifications = extractSpecifications(
      contentLoader,
      id,
      docsConfig.specifications,
    );

    // TODO: Dla nodów niżej nie ładują się poprawnie markdowny ;(
    let topicDocs: DocsContentDocs[] = [];
    contentGQLs.map(doc => {
      const d = extractFn(doc, "", compoundID);
      if (d && Object.keys(d)) {
        topicDocs.push(d);
      }
    });
    // iterate over items and do the same

    topicDocs = sortDocsByOrder(topicDocs);
    topicDocs = sortDocsByType(topicDocs);

    const topicSpec = docsConfig.spec;
    content[id].topic = {
      ...topicSpec,
      type: topicSpec.type.toLowerCase(),
      docs: topicDocs,
      specifications: topicSpecifications,
    };

    const newContentLoader = new ContentLoader();
    const newPath = `${contentLoader.getVersion()}/${id}`;

    newContentLoader.setFolder(contentLoader.getFolder());
    newContentLoader.setVersion(newPath);

    Object.keys(item.items || {}).forEach(itemName => {
      const extractedItem = extractContent(
        { [itemName]: item.items[itemName] },
        contentGQLs,
        newContentLoader,
        extractFn,
        compoundID,
      );
      content[id].items[itemName] = extractedItem[itemName];
    });
  });
  return content;
};
