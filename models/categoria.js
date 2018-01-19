var mongoose = require('mongoose');

var categoriaSchema = {
  _id: { type: String },
  padre: {
    type: String,
    ref: 'Categoria'
  },
  predecesores: [{
    type: String,
    ref: 'Categoria'
  }]
};

module.exports = new mongoose.Schema(categoriaSchema);
module.exports.categoriaSchema = categoriaSchema;
