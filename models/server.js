const express = require('express');
const fileUpload = require('express-fileupload');

const cors = require('cors');
const usuarios = require('../routes/usuarios');
const auth = require('../routes/auth');
const buscar = require('../routes/buscar');
const categorias = require('../routes/categorias');
const productos = require('../routes/productos');

const uploads = require('../routes/uploads');

const { dbConection } = require('../database/config');
class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            authPath : '/api/auth',
            buscarPath : '/api/buscar',
            usuariosPath : '/api/usuarios',
            categoriasPath : '/api/categorias',
            productosPath : '/api/productos',
            uploadsPath : '/api/uploads'
        }

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

        //SUBIR ARCHIVOS
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes(){

        this.app.use(this.paths.authPath, auth);
        this.app.use(this.paths.buscarPath, buscar);
        this.app.use(this.paths.categoriasPath, categorias);
        this.app.use(this.paths.usuariosPath, usuarios);
        this.app.use(this.paths.uploadsPath, uploads);
        this.app.use(this.paths.productosPath, productos)
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor inicializado en el puerto', this.port);
        })
    }

}

module.exports = Server;