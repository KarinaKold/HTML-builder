const fs = require('fs');
const path = require('path');
const { rm, readdir, readFile } = require('fs/promises');

const srcPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeFiles(srcPath, distPath, extFile, encoding) {
  try {
    const output = fs.createWriteStream(distPath, encoding);
    const files = await readdir(srcPath, { withFileTypes: true });
    const filesBundle = files
      .filter((file) => file.isFile())
      .filter(({ name }) => path.extname(name) === extFile);
    for (let file of filesBundle) {
      const fileSource = await readFile(path.join(srcPath, file.name), encoding);
      output.write(`${fileSource}\n`);
    }
  } catch (e) {
    console.log(e.message);
  }
}

async function createBundle() {
  try {
    await rm(distPath, { 
      force: true, 
      recursive: true 
    });
    await mergeFiles(srcPath, distPath, '.css', 'utf-8');
  } catch (e) {
    console.log(e.message);
  }
}

createBundle();