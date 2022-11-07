const { stat } = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const folder = 'secret-folder';
const folderPath = path.join(__dirname, folder);

readdir(folderPath, 
    { withFileTypes: true }).then(data => 
        data.forEach(files => {
            let filePath = path.join(folderPath, files.name);
            if (files.isFile()) {
                stat(filePath, (error, stats) => {
                    if (stats) {
                    let nameFile = files.name.split('.')[0];
                    let extFile = path.extname(filePath).slice(1);
                    let sizeFile = (stats.size / 1024).toFixed(3);
                    return console.log(`${nameFile} - ${extFile} - ${sizeFile}kb`);
                } else {
                    return console.log(error.message);
                }
            });
        }
    }));