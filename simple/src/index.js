import _traverse from "babel-traverse";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { findUp } from "find-up";
import { mkdirp } from "mkdirp";
import { promisify } from "util";
import { transformFileSync, parse } from "@babel/core";
import resolveFrom from "resolve-from";
import PQueue from "p-queue";

const traverse = _traverse.default;

/**
 * @typedef {{id:number,filePath:string}} Asset;
 * @typedef {Function(Asset)} Job;
 */

const log = {
  info: (message) => console.log(`INFO : ${chalk.green(message)} \n`),
  error: (message) => console.log(`ERROR : ${chalk.red(message)} \n`),
  warn: (message) => console.log(`WARN : ${chalk.red(message)} \n`),
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
 * @param {Job} job Callback to be add to Queue
 */
async function addJobTopQueue(job) {
  pQueue.add(job);
}

/**
 * @description Function to get babel configuration file and create a Babel File
 * @returns {BabelFileResult}  parsed BabelFileResult
 */
async function getBabelConfig() {
  const bableConfigFileName = ".babelrc";
  try {
    let babelPath = await findUp(bableConfigFileName);
    if (!babelPath) {
      log.error("Missing .babelrc");
      return;
    }
    const transformedFile = transformFileSync(babelPath);
    return transformedFile;
  } catch (e) {
    throw log.error(e);
  }
}

/**
 * @param {string} contents JS file contents
 */
function generateAst(contents) {
  return parse(contents, {
    sourceType: "module",
  });
}

/**
 * @param {Asset} path Asset asset path
 */
async function processAsset(asset) {
  if (!asset) {
    return;
  }
  const { id, filePath } = asset;
  const fileContents = await readFile(filePath, {
    encoding: "utf8",
  }).catch((e) => {
    log.error(e);
  });
  const ast = generateAst(fileContents);

  const dependencyRequests = [];

  /**@type {Map<string,any>} */
  const dependencyMap = new Map();

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencyRequests.push(node.source.value);
    },
  });

  dependencyRequests.forEach((moduleRequest, index) => {
    const srcDir = path.dirname(filePath);
    try {
      const dependencyPath = resolveFrom(srcDir, moduleRequest);
      console.log(dependencyPath, srcDir, moduleRequest);
    } catch (error) {
      log.error(error);
    }
  });
}

/**
 * @description create an asset to add into Pqueue
 * @param {string} filePath file path push to queue
 * @returns {Promise<Asset>}
 */
async function createAsset(filePath) {
  const id = pId++;
  const asset = { id, filePath };
  assetGraph.set(filePath, asset);
  log.info(`Adding ${asset.filePath} to Queue \n`);
  addJobTopQueue(() => processAsset(asset));
  return asset;
}

const ENTRY_FILE_PATH = "test/index.js";

/**
 * @description Process all assets files from entry
 * @returns {Promise<void>}
 */
async function processAssets() {
  let _ = await createAsset(ENTRY_FILE_PATH);
  return pQueue.onIdle();
}

async function main() {
  const babel = await getBabelConfig();
  const pA = await processAssets();
}

await main();
