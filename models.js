var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  //mongoose.connect('mongodb://localhost:27017/test');
  mongoose.connect('mongodb://localhost:27017/recidb');
  
// Definición de los modelos  
  var Category =
    mongoose.model('Category', require('./models/category'), 'categories');
  var Product =
    mongoose.model('Product', require('./models/product'), 'products');
  var Categoria =
	    mongoose.model('Categoria', require('./models/categoria'), 'categorias');
  var User =
	    mongoose.model('User', require('./models/user'), 'users');
  var Receta =
	    mongoose.model('Receta', require('./models/receta'), 'receta');
  
  
// Lista de modelos  
  var models = {
    Category: Category,
    Product: Product,
    Categoria: Categoria,
    User: User,
    Receta: Receta
  };

  // To ensure DRY-ness, register factories in a loop
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  return models;
};
