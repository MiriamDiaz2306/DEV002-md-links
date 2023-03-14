const {
  pathExists,
   turnPathAbsolute, 
   isExtensionMd,
    getLinks, 
    getLinkStatus,
} = require('./functions');
//verifica la existencia del archivo especificado en la ruta y rechaza la promesa si el archivo no existe. 
const mdLinks = (path, options) => new Promise((resolve, reject) => { //path (la ruta del archivo Markdown) y options (opciones para personalizar el comportamiento de la función).
  if (!pathExists(path)) {
    reject(new Error('Path does not exist'));
    return;
  }
  const pathAbsolute = turnPathAbsolute(path);//espera que sea la ruta del archivo Md y la convierte absoluta si no era
  if (!isExtensionMd(pathAbsolute)) {//verifica si el archivo es un md
    reject(new Error('Path is not an extension file .md'));
    return;
  }
  getLinks(pathAbsolute).then((arrayLinks) => { // devuelva un array de objetos con la información de los links encontrados en el archivo Md.
    if (arrayLinks.length === 0) { //si es una longitud de 0 ( no se encontraron links en el archivo), la promesa se rechaza 
      reject(new Error('Path does not have links'));
      return;
    }
    if (options === { validate: false }) {
      resolve(arrayLinks);
      return;
    }
    getLinkStatus(arrayLinks).then((response) => {//espera que devuelva un array de objetos con la información de los links,
      resolve(response); // resuelve la promesa original de "mdLinks" con el array de objetos con la información de los links, incluyendo su estado HTTP
    });
  });
});


module.exports = {
  mdLinks,
};