const path = require('path');

/*
    Regresa el absolute path del archivo encargado de iniciar la 
    aplicación (app.js en nuestro caso)
*/
module.exports = path.dirname(process.mainModule.filename);