import * as Const from "./constants.js"
import { getFiles } from "./utils.js"




async function main() {
    const files = await getFiles();
    console.log('#Files', files.length, files)
}

main()