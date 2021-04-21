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
): BtrDocsContent => {
  const content: BtrDocsContent = {};

  Object.keys(manifestSpec).forEach((id: string) => {
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

    let topicDocs: DocsContentDocs[] = [];
    contentGQLs.map(doc => {
      const d = extractFn(doc, "", id);
      if (d && Object.keys(d)) {
        topicDocs.push(d);
      }
    });
    // iterate over items and do the same

    topicDocs = sortDocsByOrder(topicDocs);
    topicDocs = sortDocsByType(topicDocs);

    const topicSpec = docsConfig.spec;
    // TODO: Tutaj mamy już dużo poprawnych dancyh, wiec pora na stworzenie wynikowego node'a
    // i przejscie po itemach w dół.
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
      );
      content[id].items[itemName] = extractedItem[itemName];
    });
  });
  return content;
};
