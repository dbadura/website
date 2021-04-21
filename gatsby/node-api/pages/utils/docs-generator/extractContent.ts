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

  Object.keys(manifestSpec).forEach((id: string) => {
    const item = manifestSpec[id];

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
    //iterate over items and do the same

    topicDocs = sortDocsByOrder(topicDocs);
    topicDocs = sortDocsByType(topicDocs);

    const topicSpec = docsConfig.spec;
    //TODO: Tutaj mamy już dużo poprawnych dancyh, wiec pora na stworzenie wynikowego node'a
    // i przejscie po itemach w dół.
    content[id] = {
      ...topicSpec,
      // type: topicSpec.type.toLowerCase(),
      docs: topicDocs,
      specifications: topicSpecifications,
    };
  });
  return content;
};

// Object.keys(manifestSpec).map(docsGroup => {
//   content[docsGroup] = {};
//   const topics = populateObject<ManifestItem>(manifestSpec[docsGroup]);
//
//   topics.map(topic => {
//     const topicId = topic.id;
//     const topicConfig = contentLoader.loadTopicConfig(topicId);
//     const topicSpec = topicConfig.spec;
//     const topicSpecifications = extractSpecifications(
//         contentLoader,
//         topicId,
//         topicConfig.specifications,
//     );
//
//     let topicDocs: DocsContentDocs[] = [];
//     contentGQLs.map(doc => {
//       const d = extractFn(doc, docsGroup, topicId);
//       if (d && Object.keys(d)) {
//         topicDocs.push(d);
//       }
//     });
//
//     topicDocs = sortDocsByOrder(topicDocs);
//     topicDocs = sortDocsByType(topicDocs);
//
//     content[docsGroup][topicId] = {
//       ...topicSpec,
//       type: topicSpec.type.toLowerCase(),
//       docs: topicDocs,
//       specifications: topicSpecifications,
//     };
//   });
// });

//FIXME refactor this
// Object.keys(manifestSpec).forEach(docsGroup => {
//   content[docsGroup] = {
//     items: {},
//     topics: {},
//   };
//   const items = populateObject<ManifestItem>(manifestSpec[docsGroup].items);
//   items.forEach(item => {
//     // topics
//     const topicId = item.id;
//     const topicConfig = contentLoader.loadTopicConfig(topicId);
//     const topicSpec = topicConfig.spec;
//     const topicSpecifications = extractSpecifications(
//       contentLoader,
//       topicId,
//       topicConfig.specifications,
//     );
//
//     let topicDocs: DocsContentDocs[] = [];
//     contentGQLs.forEach(doc => {
//       const d = extractFn(doc, docsGroup, topicId);
//       if (d && Object.keys(d)) {
//         topicDocs.push(d);
//       }
//     });
//
//     topicDocs = sortDocsByOrder(topicDocs);
//     topicDocs = sortDocsByType(topicDocs);
//
//     content[docsGroup].topics[topicId] = {
//       ...topicSpec,
//       type: topicSpec.type.toLowerCase(),
//       docs: topicDocs,
//       specifications: topicSpecifications,
//     };

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
// });
// });
