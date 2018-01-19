var express = require('express');
var status = require('http-status');
var bodyparser = require('body-parser');
var _ = require('underscore');


module.exports = function (wagner) {
  var api = express.Router();

  api.get('/product/id/:id', wagner.invoke(function (Product) {
    return function (req, res) {
      Product.findOne({
          _id: req.params.id
        },
        handleOne.bind(null, 'product', res));
    };
  }));

  api.get('/product/category/:id', wagner.invoke(function (Product) {
    return function (req, res) {
      var sort = {
        name: 1
      };
      if (req.query.price === "1") {
        sort = {
          'internal.approximatePriceUSD': 1
        };
      } else if (req.query.price === "-1") {
        sort = {
          'internal.approximatePriceUSD': -1
        };
      }

      Product.
      find({
        'category.ancestors': req.params.id
      }).
      sort(sort).
      exec(handleMany.bind(null, 'products', res));
    };
  }));


  api.get('/category/id/:id', wagner.invoke(function (Category) {
    return function (req, res) {
      Category.findOne({
        _id: req.params.id
      }, function (error, category) {
        if (error) {
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({
            error: error.toString()
          });
        }
        if (!category) {
          return res.
          status(status.NOT_FOUND).
          json({
            error: 'No encontrado'
          });
        }
        res.json({
          category: category
        });
      });
    };
  }));

  api.get('/category/parent/:id', wagner.invoke(function (Category) {
    return function (req, res) {
      Category.
      find({
        parent: req.params.id
      }).
      sort({
        _id: 1
      }).
      exec(function (error, categories) {
        if (error) {
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({
            error: error.toString()
          });
        }
        res.json({
          categories: categories
        });
      });
    };
  }));


  api.get('/category/list', wagner.invoke(function (Category) {
    return function (req, res) {
      Category.
      find().
      sort({
        _id: 1
      }).
      exec(function (error, categories) {
        if (error) {
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({
            error: error.toString()
          });
        }
        res.json({
          categories: categories
        });
      });
    };
  }));

  /*  API- Categoria */
  api.get('/categoria/list', wagner.invoke(function (Categoria) {
    return function (req, res) {
      Categoria.
      find().
      sort({
        _id: 1
      }).
      exec(function (error, categorias) {
        if (error) {
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({
            error: error.toString()
          });
        }
        res.json({
          categorias: categorias
        });
      });
    };
  }));


  /* API: Receta */
  api.post('/upload', function(req, res) {
    upload(req,res,function(err){
        console.log(req.file);
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null});
    });
});
  api.get('/receta/list', wagner.invoke(function (Receta) {
    return function (req, res) {
      Receta.
      find().
      sort({
        _nombre: 1
      }).
      exec(function (error, recetas) {
        if (error) {
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({
            error: error.toString()
          });
        }
        res.json({
          recetas: recetas
        });
      });
    };
  }));


  api.delete('/receta/id/:id', wagner.invoke(function (Receta) {
    return function (req, res) {
      Receta.remove({
        _id: req.params.id
      },
        function(err,receta)
        {
          if (err) {
            return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({
              err: err.toString()
            });
          }

        }
    
      )
      
    };
  }));
  api.get('/receta/id/:id', wagner.invoke(function (Receta) {
    return function (req, res) {
      Receta.findOne({
        _id: req.params.id
      }, function (error, receta) {
        if (error) {
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({
            error: error.toString()
          });
        }
        if (!receta) {
          return res.
          status(status.NOT_FOUND).
          json({
            error: 'No encontrado'
          });
        }
        res.json(
          receta 
        );
      });
    };
  }));


  api.post('/receta', wagner.invoke(function (Receta) {
    return function (req, res) {
      try {

        var receta = new Receta();
        receta.nombre = req.body.nombre;
        receta.elaboracion = req.body.elaboracion;
        receta.ingredientes = req.body.ingredientes;
        receta.imagen = req.body.imagen;
        receta.categoria = req.body.categoria;
        receta.tags = req.body.tags;
        receta.save(function (err) {
          if (err) {
            res.statusCode = status.BAD_REQUEST;
            res.json({
              errors: [err.message]
            });
            console.log(res);
            return res;
          };

          return res.json({
            message: 'Receta creada!'
          });
        });

      } catch (e) {
        console.log('Apo post catch');
        res.status = status.BAD_REQUEST;
        return res.json({
          error: 'No se ha podido crear la receta ' + e
        });
      }
    }
  }));

  api.put('/receta/id/:id', wagner.invoke(function (Receta) {
      return function (req, res) {
        Receta.findOne({
          _id: req.params.id
        }, function (error, receta) {
          if (error) {
            return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({
              error: error.toString()
            });
          }
          if (!receta) {
            return res.
            status(status.NOT_FOUND).
            json({
              error: 'No encontrado'
            });
          } else {
            receta.nombre = req.body.nombre;
            receta.elaboracion = req.body.elaboracion;
            receta.ingredientes = req.body.ingredientes;
            receta.imagen = req.body.imagen;
            receta.categoria = req.body.categoria;
            receta.tags = req.body.tags;
            receta.save(function (err) {
              if (err) {
                res.statusCode = status.BAD_REQUEST;
                res.json({
                  errors: [err.message]
                });
                console.log("Error backend: " + res);
                return res;
              };
              console.log("Backend ok");
              return res.json({
                receta: receta
              });
             
            })
          }
        })
      }
  }));


  /* text search API */
  api.get('/product/text/:query', wagner.invoke(function (Product) {
    return function (req, res) {
      Product.
      find({
        $text: {
          $search: req.params.query
        }
      }, {
        score: {
          $meta: 'textScore'
        }
      }).
      sort({
        score: {
          $meta: 'textScore'
        }
      }).
      limit(10).
      exec(handleMany.bind(null, 'products', res));
    };
  }));
  /* User API */
  api.put('/me/cart', wagner.invoke(function (User) {
    return function (req, res) {
      try {
        var cart = req.body.data.cart;
      } catch (e) {
        return res.
        status(status.BAD_REQUEST).
        json({
          error: 'No cart specified!'
        });
      }

      req.user.data.cart = cart;
      req.user.save(function (error, user) {
        if (error) {
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({
            error: error.toString()
          });
        }
        return res.json({
          user: user
        });
      });
    };
  }));

  api.get('/me', function (req, res) {
    if (!req.user) {
      return res.
      status(status.UNAUTHORIZED).
      json({
        error: 'Not logged in'
      });
    }

    req.user.populate({
      path: 'data.cart.product',
      model: 'Product'
    }, handleOne.bind(null, 'user', res));
  });
  return api;
};

function handleOne(property, res, error, result) {
  if (error) {
    return res.
    status(status.INTERNAL_SERVER_ERROR).
    json({
      error: error.toString()
    });
  }
  if (!result) {
    return res.
    status(status.NOT_FOUND).
    json({
      error: 'Not found'
    });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res.
    status(status.INTERNAL_SERVER_ERROR).
    json({
      error: error.toString()
    });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}