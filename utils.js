const fs = require('fs'),
    util = require('util');

const readFileAsync = util.promisify(fs.readFile),
    writeFileAsync = util.promisify(fs.writeFile),
    readDirAsync = util.promisify(fs.readdir),
    existsAsync = util.promisify(fs.exists);

module.exports.readFileAsync = readFileAsync;
module.exports.writeFileAsync = writeFileAsync;
module.exports.readDirAsync = readDirAsync;
module.exports.existsAsync = existsAsync;

module.exports = function getCorrectTime() {return new Date().setHours(new Date().getUTCHours + 2)}
