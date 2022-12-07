'use strict';
import fs from "fs";
import { Transform } from "stream";
import { EOL } from "os";

const config = {
    file: "access_tmp.log",
    ips: ["89.123.1.41", "34.48.240.111"],
    suffix: "_requests.log",
}

const piper = (ip, stream) => {
    const fileWrite = new fs.WriteStream(`./${ip}${config.suffix}`, {flags: 'a', encoding: 'utf-8'})

    const search = new RegExp(`(${ip}.*)`, 'g');

    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const transformedChunk = chunk.toString().match(search);

            if (transformedChunk.length) {
                transformedChunk.forEach(line => this.push(line + EOL))
            }

            callback();
        }
    });

    stream.pipe(transformStream).pipe(fileWrite);
}

const lesson3 = () => {
    const readStream = new fs.ReadStream('./access_tmp.log', 'utf8', (err, data) => console.log(data));

    config.ips.forEach(ip => piper(ip, readStream));
}

lesson3();