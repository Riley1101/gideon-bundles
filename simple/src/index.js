import _traverse from "babel-traverse";
import chalk from "chalk";
import fs from "fs";
import { findUp } from "find-up";
import { mkdirp } from "mkdirp";
import { promisify } from "util";
import { transformFileSync, parse } from "@babel/core";
import PQueue from "p-queue";

/**
 * @typedef {{id:number,filePath:string}} Asset;
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
async function generateAst(contents) {
  return parse(contents);
}

/**
 * @param {Asset} path Asset asset path
 */
async function processAsset(path) {
  const { id, filePath } = path;
  const fileContents = await readFile(filePath);
  const ast = generateAst(fileContents);
  const pId = pId++;
}

/**
 * @description create an asset to add into Pqueue
 * @param {string} filePath file path push to queue
 * @returns {Promise<void>}
 */
async function createAsset(filePath) {
  const id = pId++;
  const asset = { id, filePath };
  assetGraph.set(filePath, asset);
  return pQueue.onIdle();
}

const ENTRY_FILE_PATH = "./";

async function processAssets() {
  let entryAssets = createAsset(ENTRY_FILE_PATH);
  console.log(entryAssets);
}

async function main() {
  const babel = await getBabelConfig();
  const pA = await processAssets();
  console.log(pA);
}

await main();
