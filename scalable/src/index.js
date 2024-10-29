import { generateAssetId } from "./assetGraph.js";

const current_dir = process.cwd();

async function main() {
  console.log(generateAssetId(process.cwd()));
}

main();
