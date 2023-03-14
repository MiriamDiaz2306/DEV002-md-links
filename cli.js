#!/usr/bin/env node // especifica que se utilizará el intérprete de comandos node para ejecutar el script.
const { mdLinks } = require('./index');
const {  linksStats, uniqueLinks, brokenLinks  } = require('./functions');//require se utiliza en Node.js para cargar módulos

const route = process.argv[2]; //propiedad de Node.js para obtener los argumentos que se pasan al script en la línea de comandos.
const options = {
  validate: process.argv.includes('--validate') || process.argv.includes('--v'), //includes-determinar si un array o un string incluye un valor específico
  stats: process.argv.includes('--stats') || process.argv.includes('--s'),
};

// const help = option.includes('--help') || option.includes('--h');
if (route === undefined) {
  console.log(`Bienvenido, por favor ingrese una ruta para analizar.
  Con los siguentes argumentos los cuales serian:
  --validate
  --stats
  --validate --stats `)
}

 if (
(options.validate && options.stats)
  || (options.stats && options.validate)
) {//si si pasa se llama a la función mdLinks para analizar el archivo Md, y se imprimen estadísticas sobre los links encontrados en el archivo
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log(
        `\n                                      
         Stats & links validation `
      );
      console.log(
        `\n
        ${'Total links:'} ${linksStats(arrayLinks)}`,
      );
      console.log(
        `\n
        ${'Unique links:'} ${uniqueLinks(arrayLinks)}`,
      );
      console.log(
        `\n
        ${'Broken links:'} ${brokenLinks(arrayLinks)}\n`,
      );
    })
    .catch((error) => {
      console.log(error);
    });
} else if (options.validate === true) { //ocurre si validate es verdadera
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log( `          
      validando links`
      );
      arrayLinks.forEach((link) => {
        console.log(`
      ${'HREF    :'} ${link.href} 
      ${'MESSAGE :'} ${link.message} 
      ${'STATUS  :'} ${link.status} 
      ${'TEXT    :'} ${link.text}
        `);
      });
    })
    .catch((error) => {
      console.log(error);
    });
} else if (options.stats && !options.validate) { // mostrar estadísticas sobre los enlaces en el archivo sin validarlos.
  mdLinks(route, options)
    .then((arrayLinks) => {
        console.log(
          `\n                                      
         Links stats`,
        );
        console.log(
          `\n
        ${'Total links  :'} ${linksStats(arrayLinks)}`,
        );
        console.log(
          `\n
        ${'Unique links :'} ${uniqueLinks(arrayLinks)}\n`,
        );
      })
      .catch((error) => {
        console.log(error);
      });
} else if (!options.validate && !options.stats && route !== undefined) {
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log(
        `\n                                                     
      Estos links fueron encontrados:`,
      );
      arrayLinks.forEach((link) => {
        console.log(`
      ${'href    :'} ${link.href} 
      ${'path    :'} ${link.file} 
      ${'text    :'} ${link.text}`);
      });
      console.log(
        `     
    Add after your path: 
    ${
  '--validate :'
} IF YOU WANT TO VALIDATE IF THE LINKS THAT WERE FOUND WORK OR NOT
    ${
  '--stats :'
} IF YOU WANT TO RECEIVE AN OUTPUT WITH A TEXT CONTAINING BASIC STATISTICS ABOUT THE LINKS
    ${
  '--validate --stats :'
} IF YOU WANT TO OBTANIN STATISTICS THAT REQUIRE THE VALIDATION RESULTS `
        
      );
    })
    .catch((error) => {
      console.log(error);
    });
}