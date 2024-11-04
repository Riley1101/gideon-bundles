import {
  traverse,
  transformFileAsync,
  parse,
  transformFromAstAsync,
} from "@babel/core";
import { findUp } from "find-up";
import Emittery from "emittery";
import { readFile } from "./fsPromisified.js";

/**
 * @typedef {import("@babel/core").BabelFileResult} BabelFileResult;
 * @typedef {import("@babel/core").types.Node} Node;
 */

const emittery = new Emittery();

emittery.onAny((eventName, data) => {
  // @ts-ignore
  process.send({ eventName, ...data });
});

/**
 * @description Function to get babel configuration file and create a Babel File
 * @returns {Promise<BabelFileResult  | null>}  parsed BabelFileResult
 */
async function getBabelConfig() {
  const bableConfigFileName = "babel.config.js";
  try {
    let babelPath = await findUp(bableConfigFileName);
    if (!babelPath) {
      throw new Error("babel file missing");
    }
    const transformedFile = await transformFileAsync(babelPath);
    return transformedFile;
  } catch (e) {
    console.log(e);
    throw new Error("babel file missing");
  }
}

/**
 * @param {string} contents JS file contents
 * @returns {Node | null}
 */
function generateAst(contents) {
  let p = parse(contents, {
    sourceType: "module",
  });
  return /* @type {Node}*/ p;
}

process.on("message", async (/** @type {string} filePath*/ filePath) => {
  let data = await doBundle(filePath);
  if (process.send) {
    process.send({ eventName: "finished", data });
  }
});

/**
 * @param {string} filePath
 */
async function doBundle(filePath) {
  const babelObj = await getBabelConfig();
  if (!babelObj) {
    throw new Error("Missing babel config");
  }
  const fileContents = await readFile(filePath, {
    encoding: "utf8",
  }).catch((e) => {
    throw e;
  });
  const ast = generateAst(fileContents);
  if (!ast) {
    throw new Error("Missing ast");
  }

  const dependencyRequests = [];
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencyRequests.push(node.source.value);
      emittery.emit("foundDepRequest", {
        sourcePath: filePath,
        moduleId: node.source.value,
      });
    },
  });
  const { code } = babelObj;
  // @ts-ignore
  const babelOptions = babelObj.options;
  const { plugins, presets } = babelOptions;
  const transformedCodeObj = await transformFromAstAsync(ast, code || "", {
    presets,
    plugins,
  });
  return { code: transformedCodeObj };
}
