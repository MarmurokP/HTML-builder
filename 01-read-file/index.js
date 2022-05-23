const fs = require('fs');
const path = require('path');

const filePath = path.normalize('01-read-file/text.txt');
const readStream = fs.createReadStream(filePath, 'utf-8');

readStream.on('data', (chunk) => {
  console.log(chunk);
});