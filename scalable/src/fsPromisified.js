import fs from "fs";
import { promisify } from "util";
import { mkdirp } from "mkdirp";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const mkdirCp = promisify(mkdirp);
const stat = promisify(fs.stat);

/**
 * @param {string} filePath
 */
export async function isDir(filePath) {
  try {
    const fileStats = await stat(filePath);
    return fileStats.isDirectory();
  } catch (error) {
    if (error.code !== "ENOENT" || error.code === "ENOTDIR") {
      throw error;
    }
    return false;
  }
}
