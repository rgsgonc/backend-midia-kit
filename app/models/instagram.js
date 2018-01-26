var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InstagramSchema   = new Schema({
    dados: Schema.Types.Mixed,
    hora_coleta: Date,
    user: String,
    total_publicacoes: Number,
    publicacoes: Schema.Types.Mixed
});

module.exports = mongoose.model('Instagram', InstagramSchema);