var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/rest-api'); // connect to our database


var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var Bear     = require('./app/models/bear');
var Usuario = require('./app/models/usuario')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9080;        


var router = express.Router();              

router.use(function(req, res, next) {
    console.log('Algo esta acontecendo.');
    next(); 
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

    router.route('/bears')  
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        var bear = new Bear();      
        bear.name = req.body.name;  

        bear.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Bear created!' });
        });        
    })

    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);
            res.json(bears);
        });
    });

    router.route('/bears/:bear_id')
    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            bear.name = req.body.name;

            bear.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Bear updated!' });
            });
        });
    })

    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

    //-----------------------------------------------
    router.route('/usuarios')
    .post(function(req,res){
        let usuario = new Usuario();      
        usuario.nome = req.body.nome;  
        usuario.idade = req.body.idade;
        usuario.cpf = req.body.cpf;
        usuario.telefone = req.body.telefone

        usuario.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Usuário Criado!' });
        });   
    })

    .get(function(req, res) {
        Usuario.find(function(err, usuarios) {
            if (err)
                res.send(err);
            res.json(usuarios);
        });
    });

    router.route('/usuarios/:usuario_id')
    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Usuario.findById(req.params.usuario_id, function(err, usuarios) {
            if (err)
                res.send(err);
            res.json(usuarios);
        });
    })
    
app.use('/api', router);

app.listen(port);
console.log('App rodando na porta: ' + port);