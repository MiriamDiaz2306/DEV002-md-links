const fs = require('fs'); // importando y asignando file system modulo de tiempo ejecucion
const path = require('path');//trabaja c/rutas de archivo y directorio en el sistema de archivos.
const axios = require('axios');//solicitudes HTTP a servidores y recibir respuestas de ellos, y es muy útil para consumir API's

// Se verifica si la ruta existe o no
const pathExists = (route) => fs.existsSync(route);//comprueba si la ruta del archivo existe, valor booleano t o f indica si la ruta del archivo existe o no.

// Verifica si la ruta es absoluta
const pathIsAbsolute = (absoluteRoute) => path.isAbsolute(absoluteRoute);//comprueba si la ruta del archivo es una ruta absoluta. valor booleano (true o false)

// si es relativa la convierte a absoluta
const turnPathAbsolute = (route) => (pathIsAbsolute(route) ? route : path.resolve(route));// de Node.js para convertirla en una ruta absoluta.pathIsAbsolute que se supone que se ha definido anteriormente

// verifica si la extension de la ruta es MD
const isExtensionMd = (route) => path.extname(route) === '.md';// verifica la extensión del archivo especificado en route, y compara la extensión con el valor '.md'. boolean

// Si no es un archivo md busca archivos .md en un directorio
const searchMdFilesInDir = (dir) => {//devuelve una nueva lista que contiene solo los archivos con la extensión .md
  const files = fs.readdirSync(dir); // lee el contenido del directorio.devuelve una lista de archivos y directorios dentro del directorio especificado.
  return files.filter((file) => isExtensionMd(file)); // filtra los archivos con extensión .md
};
// Lee el archivo, Esta promesa del readFiles se ejecuta en cli
const readFiles = (route) => new Promise((resolve, reject) => {
  fs.readFile(route, 'utf-8', (error, data) => {//lee el contenido del archivo en la ruta especificada
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
    .then((data) => {//se llama la funcion y se espera con la informacion
      const urlLinks = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;//expresion regular que busca los enlaces del formato
      let match = urlLinks.exec(data);//encuentra el primer enlace que coincida con el formato especificado y guarda la coincidencia en la variable match.
      while (match !== null) { //ciclo que se ejecutará mientras haya coincidencias
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

const getLinkStatus = (urls) => Promise.all(urls.map((link) => axios.get(link.href) //axios envia una solicitud HTTP GET a la URL especificada en la propiedad href del objeto.
  .then((respuesta) => ({ ...link, status: respuesta.status, message: 'ok' }))
  

  .catch((error) => { // handle error
    let errorStatus;
    if (error.response) {
      // La respuesta fue hecha y el servidor respondió con un código de estado
      // que esta fuera del rango de 2xx
      errorStatus = error.response.status;
    } else if (error.request) {
      // La petición fue hecha 
      errorStatus = 500;
    } else {
      //  el recurso no se encontró
      errorStatus = 400;
    }
   
    return { ...link, status: errorStatus, message: 'fail' };
  })));


// función recibe un array de objetos que representan los links encontrados en los archivos md
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