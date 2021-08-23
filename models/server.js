const express = require('express');
const cors = require('cors');
const usuarios = require('../routes/usuarios');
const { dbConection } = require('../database/config');
class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Conectar con base de datos
        this.connectDB();

        //Midelwares
        this.middlewares();

        //Rutas de mi aplicacion

        this.routes();
    }

    async connectDB(){
        try {
            await dbConection();
        } catch (error) {
            throw error;
        }
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