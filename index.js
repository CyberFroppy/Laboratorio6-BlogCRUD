let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let uuidv4 = require('uuid/v4');

let app = express();
/* 
comentario = {    
     id: uuid.v4(),     
     titulo: string,     
     contenido: string,  
     autor: string,    
    fecha: Date } */
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.listen(8080,function(){
console.log("Server is running at port 8080")
});
//Arreglo de comentarios
const listaComentarios = [createComentario("Blog 1","El contenido del Blog 1","Carlos Perez"),
                        createComentario("Blog 2", "El contenido del Blog 2", "Jorge Gutierrez"),
                        createComentario("Blog 3","El contenido del Blog 3","Maria Ayala")];

//Formato de comentarios
function createComentario(title,content,author){
    const id = uuidv4();
    const date = new Date();
    const comentario = {
        id:id,
        titulo: title,     
        contenido: content,  
        autor: author, 
        fecha:date
    }

    return comentario;
}
//Metodo GET para regresar todos los comentarios
app.get("/blog-api/comentarios",(req,res)=>{
    //Envia como respuesta la lista de Comentarios como json y con estatus 200.
    res.json(listaComentarios).status(200);
})
//GET /blog-api/comentarios-por-autor?autor=valor 
app.get("/blog-api/comentarios-por-autor",(req,res)=>{
    let autor = req.query.autor;
    console.log(autor);
    if(autor){
        let validaAutor = listaComentarios.filter(val => autor === val.autor);
        if(validaAutor.length > 0){
            res.json(validaAutor).status(200);
        }else{
            res.statusMessage = "El autor no ha realizado comentarios";
            res.status(404).send();
        }   
    }
    else{
        res.statusMessage = "El comentario no tiene todos los parametros";
        res.status(406).send();
    }
})
//Metodo Post para Agregar un comentario nuevo
app.post('/blog-api/nuevo-comentario',(req,res)=>{
    console.log(req.body);
    let title = req.body.titulo;
    let author = req.body.autor;
    let content = req.body.contenido;
    if(title && author && content){
        let comentario = createComentario(title,content,author);
        res.json(comentario);
        listaComentarios.push(comentario);
        res.status(200).send();
    }
    else{
        res.statusMessage = "El comentario no tiene todos los parametros"
        res.status(406).send();
    }
})
//Metodo Delete para borrar un comentario
app.delete('/blog-api/remover-comentario/:id',(req,res)=>{
    let { id } = req.params;
    for(let i = 0; i <= listaComentarios.length; i++){
        if(listaComentarios[i].id == id){
            listaComentarios.splice(i, 1);
            return res.status(200).send();
        }
        else{
        res.statusMessage = "El comentario no existe";
        res.status(404).send();
        }
    }
})

app.put('/blog-api/actualizar-comentario/:id',(req,res)=>{
    let parId= req.params.id;
    let bodyId = req.body.id;
    let { titulo, contenido, autor } = req.body;

    if(!parId || !bodyId){
        console.log(parId);
        console.log(bodyId);
        res.statusMessage = "El id no coincide"
        res.status(406).send();

    }
    if(bodyId != parId){
        res.status(409).send();
        res.statusMessage = "El id no coincide";
    }
    if(!titulo && !contenido && !autor){
        res.status(406).send();
        res.statusMessage = "Campo Vacio";
    }
    listaComentarios.forEach(element => {
        if(element.id == bodyId){
            if(titulo){
                element.titulo = titulo; 
            }
            if(contenido){
                element.contenido = contenido;
            }
            if(autor){
                element.autor = autor;
            }
            res.status(202).send();
            res.statusMessage = "Cambio realizado con exito";
            return element;
        }
    });
});
