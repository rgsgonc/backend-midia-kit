var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsuarioSchema   = new Schema({
    nome: String,
    idade: Number,
    cpf: String,
    telefone: String
});

module.exports = mongoose.model('Usuario', UsuarioSchema);