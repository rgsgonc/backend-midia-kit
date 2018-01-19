var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InstagramSchema   = new Schema({
    dados: String,
    hora_coleta: Date,
    user: String
});

module.exports = mongoose.model('Instagram', InstagramSchema);