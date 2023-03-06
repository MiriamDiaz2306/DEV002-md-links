#!/usr/bin/env node
const { mdLinks } = require('./index');
const { getLinkStatus } = require('./functions');

const route = process.argv[2];
const options = {
  validate: process.argv.includes('--validate') || process.argv.includes('--v'),
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
) {
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log("validando links y stats");
      console.log(
        `\n${'TOTAL LINKS  :'} ${totalLinks(arrayLinks)}`
      );
      console.log(
        `\n${'UNIQUE LINKS :'} ${uniqueLinks(arrayLinks)}`
      );
      console.log(
        `\n${'BROKEN LINKS :'} ${brokenLinks(arrayLinks)}`
      );

      // agregar un foreach para que muestre cada link como en el readme
    })
    .catch((error) => {
      console.log(error);
    });
} else if (options.validate === true) {
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
} else if (options.stats && !options.validate) {
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log(
        `link stats`
      );
      console.log(
        `${'TOTAL LINKS  :'} ${totalLinks(arrayLinks)}`,
      );
      console.log(
        `${'UNIQUE LINKS :'} ${uniqueLinks(arrayLinks)}`,
      );
    })
    .catch((error) => {
      console.log(error);
    });
} else if (!options.validate && !options.stats && route !== undefined) {
  mdLinks(route, options)
    .then((arrayLinks) => {
      console.log(
        `Estos links fueron encontrados`);
      arrayLinks.forEach((link) => {
        console.log(`
      ${'HREF    :'} ${link.href} 
      ${'PATH    :'} ${link.file} 
      ${'TEXT    :'} ${link.text}`);
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