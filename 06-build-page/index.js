const fs = require('fs');
const path = require('path');

const bundleCSSPath = path.resolve(__dirname, './project-dist/style.css');

const builder = () => {
    fs.mkdir(path.normalize('./06-build-page/project-dist'), { recursive: true }, (mkdirErr) => {
        if (mkdirErr) {
            console.error(mkdirErr);
        };
        render().then((renderTmp) => {
            fs.writeFile(path.normalize('./06-build-page/project-dist/index.html'), renderTmp, (indexHTMLErr) => {
                if (indexHTMLErr) {
                    throw indexHTMLErr;
                }
            });
        });
        bundleCSS(path.resolve(__dirname, './styles'));
        copyFolder(path.resolve(__dirname, './assets'))
    });
};

builder();

const render = () => {
    return new Promise((resolve, reject) => {
        const templatePath = path.resolve(__dirname, './template.html');
        fs.readFile(templatePath, 'utf-8', (temlateErr, templateData) => {
        if (temlateErr) {
            reject(temlateErr);
        };        
        const pattern = new RegExp(/{{(.+)}}/gm);
        let match = pattern.exec(templateData);
        const promises = [];
        while(match) {
          const [placeholder, name] = match;   
          const componentPath = path.resolve(__dirname, `./components/${name}.html`);
          const promise = new Promise((s, f) => {
            fs.readFile(componentPath, 'utf-8', (componentErr, componentData) => {
                if (componentErr) {
                    f(componentErr);
                }              
                templateData = templateData.replace(placeholder, componentData);
                s(templateData);
            });
          });
          promises.push(promise);       
          match = pattern.exec(templateData);          
        } 
        Promise.all(promises).then((results) => {
            resolve(results.pop());
        }).catch((err) => {
            reject(err);
        });
    });
        
    }); 
    
};

const bundleCSS = (styleFolder) => {
    fs.readdir(styleFolder, (readFolderErr, styleFiles) => {
        if (readFolderErr) {
            console.error(readFolderErr);
        };
        fs.writeFile(bundleCSSPath, '', (writeError) => {
          if (writeError) {
              console.error(writeError);
          }; 
        });                     
        styleFiles.forEach((file) => {
            if (path.extname(file) === '.css') {
               const readStream = fs.createReadStream(path.normalize(`${styleFolder}/${file}`), 'utf-8');
               readStream.on('data', (chunk) => {                 
                   fs.appendFile(bundleCSSPath, `${chunk}`, (appendError) => {
                       if (appendError) {
                           console.error(appendError);
                       };                     
                   });
               });
            };       
        });
    });
  };

const copyFolder = (folder) => {
    fs.stat(folder, (err, folderStat) => {
      if (err) {
        console.error(err);
        return;
      }
      if (!folderStat.isDirectory()) {
        console.log('Invalid folder');
        return;
      }  
      const pathParse = path.parse(folder);
      const folderToCopy = path.normalize(`./06-build-page/project-dist/${pathParse.name}`);
  
      const copyFiles = (src, dest) => {
        fs.mkdir(dest, { recursive: true }, (e) => {
          if (e) {
            console.error(e);
            return;
          }
          fs.readdir(src, (readDirErr, files) => {
            if (readDirErr) {
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
                if (!fileStat.isDirectory()) {
                  fs.copyFile(filePath, copyFilePath, (copyFileErr) => {
                    if (copyFileErr) {
                      console.error(copyFileErr);
                      return;
                    }                    
                  });
                } else {
                  copyFiles(filePath, copyFilePath);
                }
              });
            });
          });
        });
      };
      copyFiles(folder, folderToCopy);
    });
  };