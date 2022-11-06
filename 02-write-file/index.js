const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');
const { stdin, stdout, exit } = require('process');

const file = 'new.txt';
const writeStream = fs.createWriteStream(path.join(__dirname, file), 'utf-8');
const readline = createInterface({
  input: stdin,
  output: stdout,
})

const stop = () => {
  readline.write('Ok. Buy!');
  readline.close();
  writeStream.end();
  exit(0);
}

readline.write(`Enter your text in ${file} \n`);
readline.on('line', (data) => {
  data.trim().toLowerCase() === 'exit' 
  ? stop() 
  : writeStream.write(`${data}\n`);
});
readline.on('SIGINT', () => {
  stop();
})