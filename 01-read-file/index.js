const fs = require('fs');
const path = require('path');

const filePath = path.normalize('01-read-file/text.txt');

fs.readFile(filePath, 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
  }
  console.log(data);
});
