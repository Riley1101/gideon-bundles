import { Level } from "level";
import path from "path";

/**
 * @description Create a cache  for bundler
 */
export const Cache = new Level(path.join(process.cwd()), ".bundler-cache");
