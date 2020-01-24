let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let app = express();


app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', function(req,res){
    res.send('Hello Express');
})
app.listen(8080,function(){
    console.log("Server is running at port 8080")
});