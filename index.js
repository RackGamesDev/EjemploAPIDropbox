//npm install dotenv dropbox fs isomorphic-fetch
require("dotenv").config();
const {Dropbox} = require("dropbox");
const fetch = require("isomorphic-fetch");
const fs = require("fs");

const dbx = new Dropbox({//conexion a dropbox
    accessToken: process.env.ACCESS_TOKEN,
    fetch
});

//las rutas serian como "./carpeta/archivo.txt" en local y "/carpeta/archivo.txt" en nube
async function getAllFiles(path){//devuelve los datos de todos los archivos de una ruta(nube)
    try {
        const files = await dbx.filesListFolder({path});
        return files.result.entries;
    } catch (error) {console.error(error);}
}

async function uploadFile(file, path){//sube un archivo, archivo(o ruta(pc) a este), ruta(nube) donde guardarlo, ademas devuelve ese mismo archivo
    try {
        const fileContent = fs.readFileSync(file, 'utf8');
        if (fileContent) {
            const fileuploaded = await dbx.filesUpload({path, contents: fileContent});
            return fileuploaded;
        } else {
            return false;
        }
    } catch (error) {console.error(error);}
}

async function deleteData(path){//borra un archivo o carpeta en la nube (ruta en la nube)
    try{
        const fileDeleted = await dbx.filesDeleteV2({path});
        return fileDeleted;
    }catch(error){console.error(error);}
}

async function downloadFile(fileToDownload, path){//devuelve un archivo de la nube, ruta(nube), ruta a guardar(pc)
    try {
        const fileDownloaded = await dbx.filesDownload({path: fileToDownload});
        const fileDownloadedIntoServer = fs.writeFileSync(path, fileDownloaded.result.fileBinary, 'binary');
        return fileDownloadedIntoServer;
    } catch (error) {console.error(error);}
}

async function createFolder(path){//crea una carpeta vacia, ruta en la nube
    try {
        await dbx.filesCreateFolderV2({path});
        return path
    } catch (error) {console.error(error);}
}

async function moveData(pathA, pathB){//mueve un archivo o una carpeta, lo que sea pathA a pathB
    try {
        //
    } catch (error) {console.error(error);}
}

async function fileExists(path){//comprueba el archivo existe y efectivamente es un archivo
    try {
        //
    } catch (error) {console.error(error);}
}

async function folderExists(path){//comprueba la carpeta existe y efectivamente es una carpeta
    try {
        //
    } catch (error) {console.error(error);}
}

async function dataExists(path){//comprueba si eso existe
    try {
        //
    } catch (error) {console.error(error);}
}






(async()=>{//ejemplo:
    //const filesList = await getAllFiles("");
    //const fileUploaded = await uploadFile("./archivo.txt", "/archivoup.txt");
    //const filesList2 = await getAllFiles("");
    //const fileDownloaded = await downloadFile("/archivoup.txt", "./archivodown.txt");
    deleteData("/asdf");
})();