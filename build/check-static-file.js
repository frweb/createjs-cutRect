//check static directory,writ the files inject to index.html,for preload there resource.

const klawSync = require('klaw-sync');
const path = require('path');
const whiteList = ['.jpg', '.png'];
const filter = function (item) {
  return whiteList.some(value => path.extname(item.path) === value);
}

const paths = klawSync(path.resolve(__dirname, '../static'), {filter})

module.exports = paths.map(item => {
  return path.relative(path.resolve(__dirname, '../'), item.path);
})

