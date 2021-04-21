import { ContentLoader } from "./contentLoader";
import { extractSpecifications } from "./extractSpecifications";
import { populateObject, sortDocsByOrder, sortDocsByType } from "./helpers";
import {
  BtrDocsContent,
  ContentGQL,
  DocsContentDocs,
  ManifestItem,
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
  const content: BtrDocsContent = {} as BtrDocsContent;

  //FIXME refactor this
  Object.keys(manifestSpec).forEach(docsGroup => {
    content[docsGroup] = {
      items: {},
      topics: {},
    };
    const items = populateObject<ManifestItem>(manifestSpec[docsGroup].items);
    items.forEach(item => {
      // topics
      const topicId = item.id;
      const topicConfig = contentLoader.loadTopicConfig(topicId);
      const topicSpec = topicConfig.spec;
      const topicSpecifications = extractSpecifications(
        contentLoader,
        topicId,
        topicConfig.specifications,
      );

      let topicDocs: DocsContentDocs[] = [];
      contentGQLs.forEach(doc => {
        const d = extractFn(doc, docsGroup, topicId);
        if (d && Object.keys(d)) {
          topicDocs.push(d);
        }
      });

      topicDocs = sortDocsByOrder(topicDocs);
      topicDocs = sortDocsByType(topicDocs);

      content[docsGroup].topics[topicId] = {
        ...topicSpec,
        type: topicSpec.type.toLowerCase(),
        docs: topicDocs,
        specifications: topicSpecifications,
      };

      // items
      // const items = populateObject<BtrDocsContent>(manifestSpec[docsGroup].items);
      // Object.keys(items).forEach(itemName => {
      //   const extractedItem = extractContent(
      //     manifestSpec[docsGroup].items[itemName],
      //     contentGQLs,
      //     contentLoader,
      //     extractFn,
      //   );
      //   content[docsGroup].items[itemName] = extractedItem;
      // });
    });
  });

  return content;
};
