import * as babylon from "babylon";
import _traverse from "babel-traverse";
import fs from "fs";
import { findUp } from "find-up";
import { mkdirp } from "mkdirp";
import { promisify } from "util";
import chalk from "chalk";
import { transformFileSync } from "@babel/core";

const log = {
  info: (message) => console.log(`INFO : ${chalk.green(message)} \n`),
  error: (message) => console.log(`ERROR : ${chalk.red(message)} \n`),
  warn: (message) => console.log(`WARN : ${chalk.red(message)} \n`),
};

const code = `function square(n) {
  return n * n;
}`;

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(mkdirp);

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

async function main() {
  let babel = await getBabelConfig();
}

await main();

//traverse(ast, {
//  enter(path) {
//    if (path.isIdentifier({ name: "n" })) {
//      path.node.name = "x";
//    }
//  },
//});
