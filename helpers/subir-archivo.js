const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'], carpeta='') => {

    return new Promise( (resolve, reject) => {
        const { archivo } = files;
        const extension = archivo.name.split('.').pop();
        const fileName = uuidv4()+'.'+extension;
    
        if( !extensionesValidas.includes( extension ) ){
            
            return reject(`La extensión ${extension} no es permitida, debe ser un tipo de archivo ${ extensionesValidas }`)
            
        }
        
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, fileName);
    
        archivo.mv(uploadPath, function(err) {
            if (err) {
                return reject( err );
            }
            
            resolve(fileName);
        });
    })



}

module.exports = {
    subirArchivo
}