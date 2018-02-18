var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InstagramSchema   = new Schema({
    dados                      : Schema.Types.Mixed,
    hora_coleta                : Date,
    totalLikesInstagram        : Number,
    totalComentariosInstagram  : Number,
    mediaLikes                 : Number,
    mediaComentarios           : Number,
    publicacoes                : Schema.Types.Mixed
});

module.exports = mongoose.model('Instagram', InstagramSchema);