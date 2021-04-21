import { Specification } from "@typings/docs";
import { ImageSpec } from "../../../../types";

export interface ContentGQL<T = any> {
  rawMarkdownBody: string;
  fields: {
    slug: string;
    imagesSpec: ImageSpec[];
  } & T;
  frontmatter: {
    title: string;
    type: string;
  };
}

export interface DocsVersions {
  [type: string]: string[];
}

export interface Docs {
  content: BtrDocsContent;
  navigation: DocsNavigation;
  manifest: ManifestSpec;
}

export interface BtrDocsContent {
  [group: string]: {
    items: { [item: string]: BtrDocsContent };
    topics: { [topic: string]: DocsContentItem };
  };
}

/* Content */
export interface DocsContent {
  [group: string]: {
    [topic: string]: DocsContentItem;
  };
}

export interface DocsContentItem {
  id: string;
  type: string;
  displayName: string;
  description: string;
  docs: DocsContentDocs[];
  specifications: Specification[];
}

export interface DocsConfig {
  spec: {
    id: string;
    displayName: string;
    description: string;
    type: string;
  };
}

export interface DocsContentDocs {
  order: string;
  title: string;
  source: string;
  imagesSpec: ImageSpec[];
  type?: string;
}

/* Navigation */
export interface DocsNavigation {
  [group: string]: DocsNavigationTopic[];
}

export interface DocsNavigationTopic {
  displayName: string;
  id: string;
}

/* Manifest */
export interface DocsManifest {
  spec: ManifestSpec;
}

export interface NewManifestItem {
  displayName: string;
  items: { [id: string]: NewManifestItem };
}

export interface NewManifest {
  [id: string]: NewManifestItem;
}

export type ManifestSpec = DocsNavigation;
export type ManifestItem = DocsNavigationTopic;
