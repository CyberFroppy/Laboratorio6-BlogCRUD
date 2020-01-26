let url = 'http://localhost:8080/blog-api';
let input;
let post;
let borrarCom;
let editarCom;
function allComments(){
    $.ajax({
        url:(url+'/comentarios'),
        method:"GET",
        dataType:"json",
        success: function(responseJSON){
            displayComments(responseJSON);
            blankInputs();
        },
        error:function(err){
            console.log(err);
        }      
    });
}
function displayComments(responseJSON){
    console.log(responseJSON);
    let resultados = document.getElementsByClassName("resultados")[0];
    resultados.innerHTML = "";
    responseJSON.map((agregar,index)=>{
        resultados.innerHTML += `
        <h4>Comentario ${index}</h4>
        <p>Id: ${agregar.id}</p>
        <p>Titulo: ${agregar.titulo}</p>
        <p>Contenido: ${agregar.contenido}</p>
        <p>Autor: ${agregar.autor}</p>
        <p>Fecha: ${agregar.fecha}</p>
        <p></p>
        `;
    });
    console.log(resultados);
}

function getComentarios(){
    let form = document.getElementById('iden');
    form.addEventListener("submit",(event)=>{
        event.preventDefault();
        allComments();
    })
}
function comentariosAut(autor){
    $.ajax({
        url:(url + '/comentarios-por-autor?autor=' + autor),
        method:"GET",
        dataType:"json",
        success: function(responseJSON){
            displayComments(responseJSON);
            blankInputs();
        },
        error:function(err){
            console.log(err);
        }      
    });
}
function comentariosxAutor(){
    let form = document.getElementById('title');
    form.addEventListener("submit",(event)=>{
        event.preventDefault();
        input = $("#inputAutor").val();
        comentariosAut(input);
        
    })
}
function postComentario(coment){
    console.log(coment)
    $.ajax({
        url:(url + '/nuevo-comentario'),
        type:"POST",
        data:JSON.stringify(coment),
        contentType:"application/json; charset=utf-8",
        success: function(responseJSON){
            allComments();
            blankInputs();
        },
        error:function(err){
            console.log(err);
        }      
    });
}
function agregarComentario(){
    let form = document.getElementById('content');
    form.addEventListener("submit",(event)=>{
        event.preventDefault();
        post = {
            titulo: $('#inputTitle').val(),
            contenido:  $('#inputContent').val(),
            autor:  $('#inputAutor').val()
        }   
        postComentario(post);
    })
}
function editarComentario(coment,identificador){
    console.log(coment)
    $.ajax({
        url:(url + '/actualizar-comentario/'+identificador),
        type:"PUT",
        data:JSON.stringify(coment),
        contentType:"application/json; charset=utf-8",
        success: function(responseJSON){
            allComments();
            blankInputs();
        },
        error:function(err){
            console.log(err);
        }      
    });
}
function editar(){
    let form = document.getElementById('author');
    form.addEventListener("submit",(event)=>{
        event.preventDefault();
        input = $("#identificadorComentario").val();
        editarCom = {
            id: $('#identificadorComentario').val(),
            titulo: $('#inputTitle').val(),
            contenido:  $('#inputContent').val(),
            autor:  $('#inputAutor').val()
        }  
        editarComentario(editarCom,input);
    })
}
function eliminarComentario(idComentario){
    $.ajax({
        url:(url + '/remover-comentario/'+idComentario),
        type:"DELETE",
        success: function(responseJSON){
            console.log("El comentario se ha eliminado con exito!");
            allComments();
            blankInputs();
        },
        error:function(err){
            console.log(err);
        }      
    });
}
function borrar(){
    let form = document.getElementById('date');
    form.addEventListener("submit",(event)=>{
        event.preventDefault();
        borrarCom = $("#identificadorComentario").val();
        eliminarComentario(borrarCom);
    })
}
function blankInputs(){
    $('#iden input').val('');
    $('#title input').val('');
    $('#content input').val('');
    $('#author input').val('');
    $('#date input').val('');
}

function init(){
    getComentarios();
    comentariosxAutor();
    agregarComentario();
    editar();
    borrar();
}
init();