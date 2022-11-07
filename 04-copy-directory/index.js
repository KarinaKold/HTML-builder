const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const copyFolderPath = path.resolve(__dirname, 'files-copy');
const folderPath = path.resolve(__dirname, 'files');

async function copyDir (src, copyFolder) {
  await fs.promises.rm(copyFolder, { 
    recursive: true, 
    force: true 
  });
  
  const files = await fs.promises.readdir(src, { withFileTypes: true });
  
  await fs.promises.mkdir(copyFolder, { recursive: true });
  
  for (let file of files) {
	const srcPath = path.join(src, file.name);
	const copyFolderPath = path.join(copyFolder, file.name);

	file.isDirectory() 
	? await copyDir(srcPath, copyFolderPath) 
	: await fs.promises.copyFile(srcPath, copyFolderPath);
  }
  stdout.write(`Folder files-copy is created!\n`);
};

copyDir(folderPath, copyFolderPath);