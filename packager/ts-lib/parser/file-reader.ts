import path from "path";
import fs from "fs";

class FileReader {
    constructor(templateDir: string) {
        fs.readdir(templateDir, (err, files) => {
            if (err) throw err;
            files.forEach((filepath: string) => {
                if (path.extname(filepath) === ".html") {
                    console.log(filepath);
                }
            })
        })
    }   
}