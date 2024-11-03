import path from "path";
import resolveForm from "resolve-from";
import { isDir } from "./fsPromisified.js";

/**
 * @typedef {import("src").ModuleRequest} ModuleRequest
 */
process.on(
  "message",
  async (/** @type {ModuleRequest} moduleRequest*/ moduleRequest) => {
    const resolved = await doBundle(moduleRequest);
    // @ts-ignore
    process.send({
      resolvedPath: resolved,
      ...moduleRequest,
    });
  },
);

/**
 * @param {ModuleRequest} param;
 */
async function doBundle({ sourcePath, moduleId }) {
  const sourceDir = (await isDir(sourcePath))
    ? sourcePath
    : path.dirname(sourcePath);
  return resolveForm(sourceDir, moduleId);
}
