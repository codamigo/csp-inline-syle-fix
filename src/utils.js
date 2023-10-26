
import * as Const from "./constants.js"
import fs from "fs"
import path from "path"



const hasInlineStyle = async (file_path) => {
    try {
        let sub_string    = ""
        const all_matches = []
        const content     = await fs.promises.readFile(file_path, 'utf8');
        const regx        = new RegExp(Const.PATTERN,'gi');
        const indexes     = [...content.matchAll(regx)].map(match => match.index );

        indexes.forEach(startIndex => {
            const endIndex = content.indexOf("\"", startIndex + Const.PATTERN.length + 1)
            sub_string = content.substring(startIndex,  endIndex+1)
            if (sub_string.includes(":"))
                all_matches.push( sub_string )
        });

        return all_matches
    } catch (error) {
        throw Error(error)
    }
} 

const getFilesHelper = (files, full_path) => {
    return files.map(async file => {
        const file_path = path.join(full_path, file);
        const stats = await fs.promises.stat(file_path)
        const all_matches = await hasInlineStyle(file_path)
        if(stats.isFile() && all_matches.length)
            return { matches:all_matches, file };
    })
}

// FIXME:  It should be done recursively
export const getFiles = async () => {
    let all_files           = []
    let components          = []
    let files               = []
    let total_occurrences   = 0
    let full_path           = ""
    

    for (const content_folder of Const.CONTENT_FOLDERS) {
        let output      = []
        full_path = path.join(Const.PATH, content_folder)

        try {
            components = await fs.promises.readdir(full_path);

            console.group(`Scanning files in <${content_folder}>`)
            for(const component of components) {
                const component_path = path.join(full_path, component)
                const stats = await fs.promises.stat(component_path)
                if( stats.isDirectory() ) {
                    files = await fs.promises.readdir(component_path)
                    files = (await Promise.all(getFilesHelper(files, component_path))).filter(file => file)
                    files.map(file => {
                        all_files.push(file.file)
                        total_occurrences += file.matches.length
                        output = [...output, ...file.matches.map(match => ({"Content Folder":content_folder,"File":file.file, "Match":match}))]
                    })
                }
            }
            if( output.length)
                console.table( output )
            console.groupEnd(`Scanning all_matches in <${content_folder}>`)
        } catch (error) {
            console.dir(error)
        }
    }
    return [all_files, total_occurrences]
}