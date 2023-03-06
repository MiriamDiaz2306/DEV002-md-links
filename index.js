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

// console.log(pathExists('C:/Users/adria/Desktop/Laboratoria/DEV001-md-links/prueba/ejemplo.md'));
// console.log(pathExists('C:/noexiste'));
// console.log(pathIsAbsolute('./functions'));
// console.log(turnPathAbsolute('./functions'));
// console.log(
// isExtensionMd('C:/Users/adria/Desktop/Laboratoria/DEV001-md-links/prueba/ejemplo.html'));
// console.log(readFiles('C:/Users/adria/Desktop/Laboratoria/DEV001-md-links/prueba/ejemplo.md'));
// console.log(createArray('C:/Users/adria/Desktop/Laboratoria/DEV001-md-links/prueba/ejemplo.md'));
// console.log(mdLinks('./prueba/ejemplo.md'))
//   .then((res) => console.log('este es de aqui', res));

module.exports = {
  mdLinks,
};