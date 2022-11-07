const fs = require('fs');
const path = require('path');
const { rm, readdir, mkdir, copyFile, readFile, writeFile } = require('fs/promises');
const distPath = path.join(__dirname, 'project-dist');
const htmlBundle = 'index.html';

async function copyFiles(src, dist) {
  try {
    const files = await readdir(src, { withFileTypes: true });
    files
      .filter((file) => file.isFile())
      .forEach(({ name }) => {
        copyFile(path.join(src, name), path.join(dist, name));
      });
  } catch (e) {
    console.log(e.message);
  }
}

async function copyFolder(src, dist) {
  try {
    await mkdir(dist, { recursive: true });
    await copyFiles(src, dist);
    const subItems = await readdir(src, { withFileTypes: true });

    subItems.forEach((subItem) => {
      if (subItem.isDirectory()) {
        copyFolder(
          path.join(src, subItem.name),
          path.join(dist, subItem.name)
        );
      }
    })
  } catch (e) {
    console.log(e.message);
  }
}

async function createCssBundle(sourcePath, distPath, extFile, encoding) {
  try {
    const outputStream = fs.createWriteStream(distPath, encoding);
    const files = await readdir(sourcePath, { withFileTypes: true });
    const filesForBundle = files
      .filter((file) => file.isFile())
      .filter(({ name }) => path.extname(name) === extFile);
    for (let file of filesForBundle) {
      const fileSource = await readFile(path.join(sourcePath, file.name), encoding);
      outputStream.write(`${fileSource}\n`);
    }
  } catch (e) {
    console.log(e.message);
  }
}

async function createHtmlBundle(template, htmlBundle, componentsFolder, componentsExt) {
  try {
    const templateSrc = await readFile(path.join(__dirname, template));
    let outputTemplateSrc = templateSrc.toString();
    const templateComponents = outputTemplateSrc.match(/{{(.*)}}/gi);

    if (templateComponents) {
      for await (let component of templateComponents) {
        const componentName = `${component.replace('{{', '').replace('}}', '')}${componentsExt}`;
        const componentSource = await readFile(path.join(__dirname, componentsFolder, componentName));
        outputTemplateSrc = outputTemplateSrc.replace(component, componentSource.toString());
      }
      await writeFile(htmlBundle, outputTemplateSrc);
    }
  } catch (e) {
    console.log(e.message);
  }
}

async function createDist() {
  try {
    await rm(distPath, { 
      force: true, 
      recursive: true 
    });
    await mkdir(distPath, { recursive: true });
    await copyFolder(
      path.join(__dirname, 'assets'),
      path.join(distPath, 'assets')
    );
    await createCssBundle(
      path.join(__dirname, 'styles'),
      path.join(distPath, 'style.css'),
      '.css',
      'utf-8'
    );
    await createHtmlBundle(
      'template.html',
      path.join(distPath, htmlBundle),
      'components',
      '.html'
    );
  } catch (e) {
    console.log(e.message);
  }
}

createDist();