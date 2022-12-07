"use strict";
import http from "http";
import url from "url";
import path from "path";
import fs from "fs";

const isFile = (filepath) => {
    return fs.lstatSync(filepath).isFile();
}

const getFileNamesInDirectory = async (directory) => {
    return await new Promise((resolve) => {
        fs.readdir(directory, (err, data) => {
            if (directory !== "/") {
                data.unshift("..");
            }
            resolve(data);
        });
    });
}

const showFileContents = async (filepath, func) => {
    return new Promise((resolve) => {
        const stream = fs.createReadStream(filepath, 'utf-8');

        stream.on('end', resolve);
        stream.pipe(func);
    });
}

const errorHandler = (res, text) => {
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.write(`<p><a href="?path=${process.cwd()}">home</a></p>`)
    res.end(`${text} not found`);
}

http.createServer(async (request, response) => {
    const queryParams = url.parse(request.url, true).query;
    const queryPath = queryParams.path ?? process.cwd();
    const queryTarget = queryParams.target ?? "";
    const navPath = path.join(queryPath, queryTarget);

    if (!fs.existsSync(queryPath)) {
        errorHandler(response, "path")
    }
    else if (fs.existsSync(queryPath) && !fs.existsSync(navPath)) {
        errorHandler(response, "file")
    }
    else {
        if (isFile(navPath)) {
            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            await showFileContents(navPath, response)
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            const res = await getFileNamesInDirectory(navPath)
            res.forEach(item => {
                response.write(`<p><a href="?target=${item}&path=${navPath}">${item}</a></p>`)
            })
        }
        response.end()
    }
}).listen(3000, 'localhost', () => console.log(`Server running at http://localhost:3000`));