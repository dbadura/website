import { BuildFor } from "../../../../src/types/common";
import { CreatePageFn, GraphQLFunction } from "../../../types";
import { createComponentCommunityPage } from "./componentPage";
import {
  addCommunityPrefixInInternalLinks,
  createCommunityPage,
  prepareData,
  preparePreviewPaths,
  prepareWebsitePaths,
} from "./helpers";

export interface CreateCommunityPages {
  graphql: GraphQLFunction;
  createPage: CreatePageFn;
  buildFor: BuildFor;
}

export const createCommunityPages = async ({
  graphql,
  createPage: createPageFn,
  buildFor,
}: CreateCommunityPages) => {
  const preparePaths =
    buildFor === BuildFor.COMMUNITY_PREVIEW
      ? preparePreviewPaths
      : prepareWebsitePaths;
  const { content, manifest } = await prepareData(graphql);

  Object.keys(content).map(docsType => {
    const topics = content[docsType].topics;
    const topicsKeys = Object.keys(topics);

    topicsKeys.map(topic => {
      const { assetsPath, pagePath, rootPagePath } = preparePaths({
        topicsKeys,
        docsType,
        topic,
      });

      let sources = content[docsType].topics[topic];
      if (buildFor !== BuildFor.COMMUNITY_PREVIEW) {
        sources = addCommunityPrefixInInternalLinks(sources);
      }

      const context = {
        content: sources,
        navigation: manifest,
        manifest,
        assetsPath,
        docsType,
        topic,
      };

      const createPage = createCommunityPage(createPageFn, context);
      createComponentCommunityPage({
        createPage,
        context,
        path: pagePath,
        rootPath: rootPagePath,
      });
    });
  });
};
