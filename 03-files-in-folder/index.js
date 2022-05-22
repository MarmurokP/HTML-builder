const fs = require('fs');
const path = require('path');

const secretFolder = './03-files-in-folder/secret-folder';

fs.readdir(secretFolder, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    const filePath = path.normalize(`${secretFolder}/${file}`);
    fs.stat(filePath, (statError, statFile) => {
      if (statError) {
        throw statError;
      }
      if (!statFile.isDirectory()) {
        const extention = path.extname(file);
        console.log(`${path.basename(file, extention)} - ${extention.slice(1)} - ${statFile.size / 1000}kb`);
      }
    });
  });
});