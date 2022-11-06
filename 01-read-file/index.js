const fs = require('fs');
const path = require('path');
const readStream = new fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

readStream.on('readable', () => {
    const data = readStream.read();
    data ? console.log(data): "Error";
});