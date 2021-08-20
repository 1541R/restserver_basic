const express = require('express');
const cors = require('cors');
const usuarios = require('../routes/usuarios');
class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Midelwares
        this.middlewares();

        //Rutas de mi aplicacion

        this.routes();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );

        //LECTURA Y PARSEO DEL BODY
        this.app.use( express.json() );
        //DIRECTORIO PUBLICO
        this.app.use( express.static('public') );
    }

    routes(){
        
        this.app.use('/api/usuarios', usuarios);

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor inicializado en el puerto', this.port);
        })
    }

}

module.exports = Server;