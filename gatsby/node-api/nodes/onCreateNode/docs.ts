import { Node } from "gatsby";
import { DOCS_PATH_PREFIX, DOCS_FILENAME_REGEX } from "../../../constants";
import { CreateNodeField } from "../../../types";

interface OnCreateDocsNode {
  node: Node;
  relativePath: string;
  createNodeField: CreateNodeField;
}

export const onCreateDocsNode = ({
  node,
  relativePath,
  createNodeField,
}: OnCreateDocsNode) => {
  //TODO: Regex jest do śmieci
  const splitted = relativePath.split("/");
  if (splitted.length < 6) {
    return;
  }

  const version = splitted[2];
  const id = splitted[3];
  const additionPath = splitted.slice(4, splitted.length - 2);
  const fileName = splitted[splitted.length - 1];

  const match = DOCS_FILENAME_REGEX.exec(relativePath);

  let type = null;
  try {
    const docsPath = splitted.slice(0, splitted.length - 2).join("/");
    const path = `../../../../content/${docsPath}/docs.config.json`;
    type = require(path).spec.type.toLowerCase();
  } catch (err) {
    console.error(err);
    return;
  }

  createNodeField({
    node,
    name: "docInfo",
    value: {
      id,
      type,
      version,
      fileName,
    },
  });

  const slug = [DOCS_PATH_PREFIX, version, type, id]
    .concat(additionPath)
    .join("/");
  createNodeField({
    node,
    name: "slug",
    value: slug,
  });
};
