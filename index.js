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
        fs.unlink(path, ()=>{});
        return fileDownloadedIntoServer;
    } catch (error) {console.error(error);}
}

async function createFolder(path){//crea una carpeta vacia, ruta en la nube
    try {
        await dbx.filesCreateFolderV2({path});
        return path
    } catch (error) {console.error(error);}
}

async function moveData(pathA, pathB, name){//mueve un archivo o una carpeta, lo que sea pathA a pathB, se requiere el nombre nuevo en la nube
    try {
        const fileDownloaded = await dbx.filesDownload({path: pathA});
        const fileDownloadedIntoServer = await fs.writeFileSync("./files/" + name, fileDownloaded.result.fileBinary, 'binary');
        const fileUploaded = await uploadFile("./files/" + name, pathB + name);
        await deleteData(pathA);
        await fs.unlink("./files/" + name, ()=>{});
    } catch (error) {console.error(error);}
}
async function copyData(pathA, pathB, name){//copia un archivo o una carpeta, lo que sea pathA a pathB, se requiere el nombre nuevo en la nube
    try {
        const fileDownloaded = await dbx.filesDownload({path: pathA});
        const fileDownloadedIntoServer = await fs.writeFileSync("./files/" + name, fileDownloaded.result.fileBinary, 'binary');
        const fileUploaded = await uploadFile("./files/" + name, pathB + name);
        await fs.unlink("./files/" + name, ()=>{});
    } catch (error) {console.error(error);}
}
async function rename(path, oldName, name){//renombra un archivo, ubicacion, nuevo nombre
    try {
        const fileDownloaded = await dbx.filesDownload({path: path + oldName});
        const fileDownloadedIntoServer = await fs.writeFileSync("./files/" + oldName, fileDownloaded.result.fileBinary, 'binary');
        const fileUploaded = await uploadFile("./files/" + oldName, path + name);
        await deleteData(path + oldName);
        await fs.unlink("./files/" + oldName, ()=>{});
    } catch (error) {console.error(error); return false}
}

async function fileExists(path){//comprueba el archivo existe y efectivamente es un archivo
    try {
        const fileDownloaded = await dbx.filesDownload({path: path});
        return fileDownloaded != null;
    } catch (error) {/*console.error(error);*/ return false}
}



(async()=>{//ejemplo:
    //const filesList = await getAllFiles("");
    //const fileUploaded = await uploadFile("./files/archivo.txt", "/archivoup.txt");
    //const filesList2 = await getAllFiles("");
    //const fileDownloaded = await downloadFile("/archivoup.txt", "./files/archivodown.txt");
    //deleteData("/archivoup.txt");
    //createFolder("/asdf");
    //deleteData("/asdf");
    //await moveData("/ca/aa.txt", "/cb/", "aa.txt");
    //rename("/", "aa.txt", "bb.txt");
    //console.log(await fileExists("/bab.txt"));
})();