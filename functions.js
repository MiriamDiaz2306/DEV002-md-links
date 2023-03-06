const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Se verifica si la ruta existe o no
const pathExists = (route) => fs.existsSync(route);

// Verifica si la ruta es absoluta
const pathIsAbsolute = (absoluteRoute) => path.isAbsolute(absoluteRoute);

// si es relativa la convierte a absoluta
const turnPathAbsolute = (route) => (pathIsAbsolute(route) ? route : path.resolve(route));

// verifica si la extension de la ruta es MD
const isExtensionMd = (route) => path.extname(route) === '.md';

// Si no es un archivo md busca archivos .md en un directorio
const searchMdFilesInDir = (dir) => {
  const files = fs.readdirSync(dir); // lee el contenido del directorio
  return files.filter((file) => isExtensionMd(file)); // filtra los archivos con extensión .md
};
// Lee el archivo, Esta promesa del readFiles se ejecuta en cli
const readFiles = (route) => new Promise((resolve, reject) => {
  fs.readFile(route, 'utf-8', (error, data) => {
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
});

// Función para extraer los links
const getLinks = (route) => new Promise((resolve, reject) => {
  const links = [];
  readFiles(route)
    .then((data) => {
      const urlLinks = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;
      let match = urlLinks.exec(data);
      while (match !== null) {
        links.push({
          href: match[2],
          text: match[1],
          file: route,
        });
        match = urlLinks.exec(data);
      }
      (resolve(links));
    })
    .catch((error) => reject(error));
});

const getLinkStatus = (urls) => Promise.all(urls.map((link) => axios.get(link.href)
  .then((respuesta) => ({ ...link, status: respuesta.status, message: 'ok' }))
  // console.log(respuesta);

  .catch((error) => { // handle error
    let errorStatus;
    if (error.response) {
      // La respuesta fue hecha y el servidor respondió con un código de estado
      // que esta fuera del rango de 2xx
      errorStatus = error.response.status;
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      errorStatus = 500;
    } else {
      // Algo paso al preparar la petición que lanzo un Error
      errorStatus = 400;
    }
    // console.log('errorStatus', errorStatus);
    return { ...link, status: errorStatus, message: 'fail' };
  })));


// Esta función recibe un array de objetos que representan los links encontrados en los archivos markdown
const linksStats = (array) => `${array.length}`;

// Recibe el mismo array de objetos de la función anterior y utiliza un Set para eliminar los links duplicados. Retorna la cantidad de links únicos encontrados.
const uniqueLinks = (array) => {
  const unique = new Set(array.map((link) => link.href));
  return `${unique.size}`;
};

// Recibe el mismo array de objetos de la función anterior y filtra aquellos links que tienen un status de 'Fail' o que estén fuera del rango de 199 a 400. Retorna la cantidad de links rotos encontrados.
const brokenLinks = (array) => {
  const broken = array.filter((link) => link.status === 'Fail' || link.status > 400 || link.status < 199);
  return `${broken.length}`;
};

module.exports = {
  pathExists,
  pathIsAbsolute,
  turnPathAbsolute,
  isExtensionMd,
  readFiles,
  getLinks,
  getLinkStatus,
  linksStats,
  uniqueLinks,
  brokenLinks,
  searchMdFilesInDir
};