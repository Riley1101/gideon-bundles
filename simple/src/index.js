import PQueue from "p-queue";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import resolveFrom from "resolve-from";
import { findUp } from "find-up";
import { mkdirp } from "mkdirp";
import { promisify } from "util";
import { transformFileSync, parse, traverse } from "@babel/core";

/**
 * @typedef {{id:number,filePath:string}} Asset;
 * @typedef {function(Asset):PromiseLike<void>} Job;
 * @typedef {import("@babel/core").BabelFileResult} BabelFileResult;
 * @typedef {import("@babel/core").types.Node} Node;
 */

const log = {
  info: (/** @type {string} */ message) =>
    console.log(`INFO : ${chalk.green(message)} \n`),
  error: (/** @type {string} */ message) =>
    console.log(`ERROR : ${chalk.red(message)} \n`),
  warn: (/** @type {string} */ message) =>
    console.log(`WARN : ${chalk.red(message)} \n`),
};

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(mkdirp);
let pId = 0;

/**
 * @type {Map<string,Asset>} Asset graph
 * */
const assetGraph = new Map();

const pQueue = new PQueue();

/**
 * @description To add asset Jobs to queue
 * @param {Function} job Callback to be add to Queue
 */
async function addJobTopQueue(job) {
  pQueue.add(() => job());
}

/**
 * @description Function to get babel configuration file and create a Babel File
 * @returns {Promise<BabelFileResult | null>}  parsed BabelFileResult
 */
async function getBabelConfig() {
  const bableConfigFileName = ".babelrc";
  try {
    let babelPath = await findUp(bableConfigFileName);
    if (!babelPath) {
      log.error("Missing .babelrc");
      return null;
    }
    const transformedFile = transformFileSync(babelPath);
    return transformedFile;
  } catch (e) {
    throw log.error(e);
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

/**
 * @param {Asset} asset Asset asset path
 * @param {BabelFileResult} babel Babel instance
 * @returns void
 */
async function processAsset(asset, babel) {
  if (!asset) {
    return;
  }
  const { id, filePath } = asset;
  const fileContents = await readFile(filePath, {
    encoding: "utf8",
  }).catch((e) => {
    log.error(e);
    throw e;
  });
  const ast = generateAst(fileContents);
  if (!ast) {
    log.error("Ast parse error");
    throw new Error("Missing ast");
  }

  const dependencyRequests = [];

  /**@type {Map<string,any>} */
  const dependencyMap = new Map();
  console.log(ast);

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencyRequests.push(node.source.value);
    },
  });

  dependencyRequests.forEach((moduleRequest, index) => {
    try {
      const srcDir = path.dirname(filePath);
      const dependencyPath = resolveFrom(srcDir, moduleRequest);
      /*
       * @type {Asset} dependencyAsset dependency asset
       */
      const dependencyAsset =
        assetGraph.get(dependencyPath) || createAsset(dependencyPath, babel); // either find the assets in graph or create new one;
      console.log(dependencyAsset);
    } catch (error) {
      log.error(error);
    }
  });
}

/**
 * @description create an asset to add into Pqueue
 * @param {string} filePath file path push to queue
 * @param {BabelFileResult} babel Babel instance
 * @returns {Promise<Asset>}
 */
async function createAsset(filePath, babel) {
  const id = pId++;
  const asset = { id, filePath };
  assetGraph.set(filePath, asset);
  log.info(`Adding ${asset.filePath} to Queue \n`);
  addJobTopQueue(() => processAsset(asset, babel));
  return asset;
}

const ENTRY_FILE_PATH = "test/index.js";

/**
 * @description Process all assets files from entry
 * @param {BabelFileResult} babel Babel instance
 * @returns {Promise<void>}
 */
async function processAssets(babel) {
  let _ = await createAsset(ENTRY_FILE_PATH, babel);
  return pQueue.onIdle();
}

async function main() {
  const babel = await getBabelConfig();
  if (!babel) {
    throw new Error("Error creating bable file");
  }
  const pA = await processAssets(babel);
  pQueue.start();
}

await main();
