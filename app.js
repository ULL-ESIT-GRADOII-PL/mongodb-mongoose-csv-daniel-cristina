"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

var mongoose = require('mongoose');
  var contador = 0;
var db = mongoose.connect('mongodb://localhost/practica9');

var Schema = mongoose.Schema;

const entradaSchema = mongoose.Schema({ 
    "nombre" : String,
    "datos" : String
  });
  
    var Entrada = mongoose.model("Entrada", entradaSchema);
    
           var modelo = db.model('Entradas', entradaSchema);
  modelo.count({}, function(err, c) {
    contador = c;
        
  });
  //console.log('Count is ' + contador);
app.get('/save', (request, response) => {
  var contenido = new Entrada ({nombre: request.query.user, datos: request.query.input});
  
   let p1 = contenido.save(function (err) {
        console.log('Count is ' + contador);
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${contenido}`);
  });
    Promise.all([p1]).then( (value) => { 
    mongoose.connection.close(); 
  });
  response.render('index', {title: 'CSV'});
});
/*
var mongoose = require('mongoose');
 var db = mongoose.connect('mongodb://localhost/myApp');
 var userSchema = new mongoose.Schema({name:String,password:String});
 var userModel =db.model('userlists',userSchema);
 var anand = new userModel({ name: 'anand', password: 'abcd'});
 anand.save(function (err, docs) {
   if (err) {
       console.log('Error');
   } else {
       userModel.count({name: 'anand'}, function(err, c) {
           console.log('Count is ' + c);
      });
   }
 }); */





app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate');

app.get('/', (request, response) => {     
  response.render ('index', { title: "CSV"} );
});

app.get('/csv', (request, response) => {
  response.send({ "rows": calculate(request.query.input) });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
