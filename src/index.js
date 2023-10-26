
import { getFiles } from "./utils.js"


async function main() {
    const files = await getFiles();
    console.group("\nStats")
        console.log('-'.repeat(35))
        console.log(`Total files #${files[0].length}`, files[0])
        console.log(`Total occurrences #${files[1]}`)
        console.log('-'.repeat(35))
    console.groupEnd("stats")
}

main()