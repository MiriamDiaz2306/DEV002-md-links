const {
  pathExists,
   turnPathAbsolute, 
   isExtensionMd,
    getLinks, 
    getLinkStatus,
} = require('./functions');

const mdLinks = (path, options) => new Promise((resolve, reject) => { //path (la ruta del archivo Markdown) y options (opciones para personalizar el comportamiento de la función).
  if (!pathExists(path)) {
    reject(new Error('Path does not exist'));
    return;
  }
  const pathAbsolute = turnPathAbsolute(path);
  if (!isExtensionMd(pathAbsolute)) {
    reject(new Error('Path is not an extension file .md'));
    return;
  }
  getLinks(pathAbsolute).then((arrayLinks) => {
    if (arrayLinks.length === 0) {
      reject(new Error('Path does not have links'));
      return;
    }
    if (options === { validate: false }) {
      resolve(arrayLinks);
      return;
    }
    getLinkStatus(arrayLinks).then((response) => {
      resolve(response);
    });
  });
});


module.exports = {
  mdLinks,
};