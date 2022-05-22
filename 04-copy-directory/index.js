const fs = require('fs');
const path = require('path');

const copyFolder = (folder) => {
    fs.stat(folder, (err, folderStat) => {        
      if (err) {
          console.error(err);
          return;
      }
      if (!folderStat.isDirectory()){
          console.log('Invalid folder');
          return;
      }
      
      const pathParse = path.parse(folder);
      const folderToCopy = path.normalize(`${pathParse.dir}/${pathParse.name}-copy`);

      const copyFiles = (src, dest) => {
        fs.mkdir(dest, {recursive: true}, (e) => {
            if (e) {
              console.error(e);
              return;
            }
            fs.readdir(src, (readDirErr, files) => {
               
              if (readDirErr){
                  console.error(readDirErr);
                  return;
              }
              files.forEach((file) => {
                
                  const filePath = path.normalize(`${src}/${file}`);
                  const copyFilePath = path.normalize(`${dest}/${file}`);
                  
                  fs.stat(filePath, (filePathErr, fileStat) => {        
                      if (filePathErr) {
                          console.error(filePathErr);
                          return;
                      }
                      if (!fileStat.isDirectory()){
                          fs.copyFile(filePath, copyFilePath, (copyFileErr) => {
                              if (copyFileErr) {
                                  console.error(copyFileErr);
                                  return;
                              }
                              console.log(`File ${filePath} copied`);
                          });
                      } else {
                          copyFiles(filePath, copyFilePath);
                      }
                  });
                  
              });
          });
        }); 

      } 
      copyFiles(folder, folderToCopy);          
    });

};
copyFolder(path.resolve('./04-copy-directory/files'));