var mongoose = require('mongoose');
//var Categoria = require('./categoria');


var recetaSchema = {
  nombre: { type: String, required: [true, 'Es obligatorio indicar el nombre de la receta'] },
  // Pictures must start with "http://"
  imagen: { type: String },
  tags: [{ type: String }],
//  ingredientes: [{ type: String }],
ingredientes: [{ingrediente: String, cantidad: String}],
  elaboracion: { type: String },
//  categoria: { type: String, ref: 'Categoria'}
categoria: { type: String }

};

var schema = new mongoose.Schema(recetaSchema);

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;
module.exports.recetaSchema = recetaSchema;
