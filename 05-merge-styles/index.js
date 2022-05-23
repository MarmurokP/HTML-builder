const fs = require('fs');
const path = require('path');

const bundleCSS = (styleFolder) => {
  fs.readdir(styleFolder, (readFolderErr, styleFiles) => {
      if (readFolderErr) {
          console.error(readFolderErr);
      };    
      styleFiles.forEach((file) => {
          if (path.extname(file) === '.css') {
             const readStream = fs.createReadStream(path.normalize(`${styleFolder}/${file}`), 'utf-8');
             readStream.on('data', (chunk) => {                 
                 fs.appendFile('./05-merge-styles/project-dist/bundle.css', `${chunk}`, (appendError) => {
                     if (appendError) {
                         console.error(appendError);
                     };                     
                 });
             });
          };       
      });
  });
};

bundleCSS(path.resolve('./05-merge-styles/styles'));