import PQueue from "p-queue";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import resolveFrom from "resolve-from";
import { findUp } from "find-up";
import { mkdirp } from "mkdirp";
import { promisify } from "util";
import {
  transformFileAsync,
  parse,
  traverse,
  transformFromAstAsync,
} from "@babel/core";

/**
 * @typedef {Map<string,any>} DependencyMap;
 * @typedef {{id:number,filePath:string,code?:string | null,dependencyMap?:DependencyMap}} Asset;
 * @typedef {function(Asset):PromiseLike<void>} Job;
 * @typedef {import("@babel/core").BabelFileResult} BabelFileResult;
 * @typedef {import("@babel/core").TransformOptions} TransformOptions;
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
 * Babel Config Processor
 * */

/**
 * @description Function to get babel configuration file and create a Babel File
 * @returns {Promise<BabelFileResult | null>}  parsed BabelFileResult
 */
async function getBabelConfig() {
  const bableConfigFileName = "babel.config.json";
  try {
    let babelPath = await findUp(bableConfigFileName);
    if (!babelPath) {
      log.error("Missing .babelrc");
      return null;
    }
    const transformedFile = await transformFileAsync(babelPath);
    return transformedFile;
  } catch (e) {
    throw log.error(e);
  }
}

/**
 * Processing Assets and Dependency Graph
 * */

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
  const { filePath } = asset;
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

  /**@type {DependencyMap} dependencyMap */
  const dependencyMap = new Map();

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencyRequests.push(node.source.value);
    },
  });

  dependencyRequests.forEach(async (moduleRequest) => {
    try {
      const srcDir = path.dirname(filePath);
      const dependencyPath = resolveFrom(srcDir, moduleRequest);
      /*
       * @type {Asset} dependencyAsset dependency asset
       */
      const dependencyAsset =
        assetGraph.get(dependencyPath) ||
        (await createAsset(dependencyPath, babel)); // either find the assets in graph or create new one;

      dependencyMap.set(moduleRequest, dependencyAsset);
    } catch (error) {
      log.error(error);
    }
  });
  const { code } = babel;
  /** @type {TransformOptions} options; */
  // @ts-ignore
  const babelOptions = babel.options;
  const { plugins, presets } = babelOptions;
  const transformedCodeObj = await transformFromAstAsync(ast, code || "", {
    presets,
    plugins,
  });
  if (transformedCodeObj) {
    const { code: transformCode } = transformedCodeObj;
    asset.dependencyMap = dependencyMap;
    asset.code = transformCode;
  }
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
  await createAsset(ENTRY_FILE_PATH, babel);
  return pQueue.onIdle();
}

async function packageAssetsInfoBundle() {
  let modules = "";
  assetGraph.forEach((assetInfo) => {
    let mapping = {};
    assetInfo.dependencyMap?.forEach(
      (depAsset, key) => (mapping[key] = depAsset.id),
    );
    modules += `${assetInfo.id}: [ 
    (require, module, exports) => {
      ${assetInfo.code}
    },
    ${JSON.stringify(mapping)}
  ],`;
  });

  const result = `
  (function (modules) {
    function require(id) {
      const [fn, mapping] = modules[id];

      function localRequire(name) {
       return require(mapping[name]);
      } 

      const module = {exports: {}};

      fn(localRequire, module, module.exports);

      return module.exports;
    }
    require(0);

  })({${modules}})
  `;

  await mkdirp("dist");
  await writeFile("dist/bundle.js", result, "utf8");
}

async function main() {
  const babel = await getBabelConfig();
  if (!babel) {
    throw new Error("Error creating bable file");
  }
  await processAssets(babel);
  await packageAssetsInfoBundle();
}

await main();
