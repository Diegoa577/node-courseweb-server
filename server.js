const express = require ('express');
const hbs = require('hbs');
const fs = require('fs');

const port=process.env.PORT || 3000;
//nodemon server.js -e js,hbs
var app = express();

//partials suport para reutilizar codigo en hbs
hbs.registerPartials(__dirname + '/views/partials')
//template library
app.set('view engine', 'hbs');

//middleware
app.use((req, res, next)=>{
  var now = new  Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log', log + '\n',(err)=>{
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  //no inicia si no se coloca next
  //se puee usar para asycronis de leer una basedatos
next();
});
//se usa de acuerdo al orden escrito
// app.use((req,res,next)=>{
//   res.render('maintenance.hbs')
// });
//agregar algo a middleware
//express.static take absolute path
//encadena el server configurado ara que inicie
app.use(express.static(__dirname + '/public'));
//para evitar que siempre se use el mismo codigo
hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear()
})

hbs.registerHelper('screamIt',(text)=>{
  return text.toUpperCase();
});

app.get('/',(req, res) =>{
  // res.send('<h1>Hello Express!</h1>');
  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  })
});

app.get('/about',(req, res)=>{
  //pasar argumentos
  res.render('about.hbs',{
    pageTitle: 'About Page'
  });
  // res.render('about.hbs')
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects'
  });
});

app.get('/bad',(req, res)=>{
  res.send({
    errorMessage: 'Unable'
  })
})
//aplicaicon port to machine
//segundo argumento es opcional para hacer algo en cuando inicie el servidor
//heroku variable change 3000
//start in package json
app.listen(port, () =>{
  console.log(`Server is up on port ${port}`);
});
