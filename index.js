var express = require('express');
var wagner = require('wagner-core');

var multer = require('multer');

require('./models')(wagner);
require('./dependencies')(wagner);


var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

var bodyParser = require('body-parser');

//TO-DO: Check si en lugar de urlencoded (que funciona con insomnia) es necesario leer json
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1', require('./api')(wagner));


//Serve up static HTML pages from the file system.
//For instance, '/6-examples/hello-http.html' in
//the browser will show the '../client/hello-http.html'
//file.
//app.use(express.static('../', { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));

app.listen(3000);
console.log('API Recipience arrancada: a la escucha en puerto 3000!');
