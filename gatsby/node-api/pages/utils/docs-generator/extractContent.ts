import { ContentLoader } from "./contentLoader";
import { extractSpecifications } from "./extractSpecifications";
import { populateObject, sortDocsByOrder, sortDocsByType } from "./helpers";
import {
  BtrDocsContent,
  ContentGQL,
  DocsContentDocs,
  ManifestItem,
  ManifestSpec,
} from "./types";

export const extractContent = <T extends ContentGQL>(
  manifestSpec: ManifestSpec,
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
    const topics = populateObject<ManifestItem>(manifestSpec[docsGroup]);

    topics.forEach(topic => {
      const topicId = topic.id;
      const topicConfig = contentLoader.loadTopicConfig(topicId);
      const topicSpec = topicConfig.spec;
      const topicSpecifications = extractSpecifications(
        contentLoader,
        topicId,
        topicConfig.specifications,
      );

      let topicDocs: DocsContentDocs[] = [];
      contentGQLs.map(doc => {
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
    });
  });

  return content;
};
