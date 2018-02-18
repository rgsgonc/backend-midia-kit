var moment = require('moment');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/rest-api'); // connect to our database

var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var Instagram  = require('./app/models/instagram');
var schedule   = require('node-schedule');

var webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
const controlFlow = webdriver.promise.controlFlow();
var Promise = webdriver.promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9080;        

var router = express.Router();              

router.use(function(req, res, next) {
    console.log('Iniciando a coleta...');
    next(); 
});

router.route('/insta')  
.post(function(req, res) {
    // var rule = new schedule.RecurrenceRule();
    // rule.minute = new schedule.Range(0, 59, 1);
    // schedule.scheduleJob(rule, function(){
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
    
        //Acessando o navegador via selenium, logando no insta contateste9915 e acessando o insta passado no driver get.
        driver.manage().window().maximize();
        driver.get('https://www.instagram.com');
        let login = ('//p[@class="_g9ean"]//a');
        driver.sleep(2000);
        driver.findElement(By.xpath(login)).click();
        let user = ('//input[@name="username"]')
        let senha = ('//input[@type="password"]');
        driver.findElement(By.xpath(user)).sendKeys("contateste9915");
        driver.findElement(By.xpath(senha)).sendKeys("99151767");
        let botao = ('//button[@class="_qv64e _gexxb _4tgw8 _njrw0"]');
        driver.findElement(By.xpath(botao)).click();
        driver.sleep(1000);
        driver.get('https://www.instagram.com/kadalsasso');

        
        function populatePosts () {    
            const media = _sharedData.entry_data.ProfilePage[0].user.media;
            const dadosUser = window._sharedData.entry_data.ProfilePage[0].user;
            
            window.scrohla = { 
                totalPosts : media.count, 
                posts : [],
                dadosUser : dadosUser
            };
        
            //Fazendo adaptação do retorno do json, para que todas as publicacoes e primeiros posts fiquem iguais.
            media.nodes.forEach( item => {
                item.edge_media_to_comment   = item.comments;
                item.edge_media_preview_like = item.likes; 
                item.shortcode               = item.code;

                let edge_media_to_caption = {
                    edges: [
                        {
                            node: {
                                text: item.caption
                            }
                        }
                    ]
                };

                item.edge_media_to_caption = edge_media_to_caption;
                item.taken_at_timestamp = item.date;
                window.scrohla.posts.push({ node : item });
            });

            //Aqui é a parte responsável por concatenar os 12 primeiros posts com todas as publicacoes do instagram.
            var origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener("load", function() {
                    const response = JSON.parse(this.responseText);
                    if(response.data){
                        window.scrohla.posts = window.scrohla.posts.concat(response.data.user.edge_owner_to_timeline_media.edges);
                    }
                });
                origOpen.apply(this, arguments);
            };
        
            return {
                totalPosts : window.scrohla.totalPosts,
                totalFound : window.scrohla.posts.length,
                dadosUser  : window.scrohla.dadosUser
            }
        };

        //Faz o scroll até o final das publicacoes do instagram.
        function scroll(){
            driver.sleep(2000); 
            driver.executeScript(function(){
                window.scrollTo(0, 500000);
            });
            
            driver.executeScript(function(){
                return {
                    totalPosts : window.scrohla.totalPosts, 
                    totalFound : window.scrohla.posts.length
                };
            }).then(result => {
                if(result.totalPosts >= result.totalFound){
                    scroll();
                }
                console.log(`Coletando ${result.totalFound} de ${result.totalPosts}`);
            });
        };

        //Pega todas as publicações do instagram.
        function getPosts(){
            return driver.executeScript(function(){
                return window.scrohla.posts;
            });
        };

        //Pega as informaçoes das 12 primeiras publicacoes, e outras informacoes como qtdFotos, qtdSeguidores, qtdSeguindo, etc.
        function getDadosUser(){
            return driver.executeScript(function(){
                return window.scrohla.dadosUser;
            });
        };

        driver.executeScript(populatePosts).then(result => {
            if(result.totalFound < result.totalPosts ){
                scroll();
            }  
            getPosts().then(posts =>{
                getDadosUser().then(dados => {
                    let instagram = new Instagram();
                    instagram.hora_coleta = new Date();            
                    let minhasPublicacoes = [];
                    let meusDados = [];
                    let somaLike = 0;
                    let somaComentario = 0;
                    let mediaLikes = 0;
                    let mediaComentarios = 0;
                    //for (let i in posts)
                    for(let i=0; i < posts.length; i++){
                        // if (!posts[i].node.edge_media_to_caption.edges[0]) {
                        //     console.log(JSON.stringify(posts[i]));
                        // }
                        
                        //Pegando a quantidade total de likes no instagram.
                        let qtdLikes = posts[i].node.edge_media_preview_like.count;
                        somaLike = somaLike + qtdLikes;

                        //Pegando a quantidade total de comentarios no instagram.
                        let qtdComentarios = posts[i].node.edge_media_to_comment.count;
                        somaComentario = somaComentario + qtdComentarios;

                        //Pegando a média de curtidas do instagram.
                        mediaLikes = somaLike / posts.length;

                        //Pegando a média de comentários do instagram.
                        mediaComentarios = somaComentario / posts.length;
                        

                        //Objeto responsável por pegar todas as publicações.
                        let pup = {
                            qtdLikes         : posts[i].node.edge_media_preview_like.count,
                            qtdComentarios   : posts[i].node.edge_media_to_comment.count,
                            legenda          : posts[i].node.edge_media_to_caption.edges[0] ? posts[i].node.edge_media_to_caption.edges[0].node.text : null,
                            dataPublicacao   : moment(new Date(posts[i].node.taken_at_timestamp * 1000)).format('DD/MM/YYYY HH:mm:ss'),
                            thumbnail        : posts[i].node.thumbnail_src,
                            thumbnail150x150 : posts[i].node.thumbnail_resources[0].src,
                            thumbnail240x240 : posts[i].node.thumbnail_resources[1].src,
                            thumbnail320x320 : posts[i].node.thumbnail_resources[2].src,
                            thumbnail480x480 : posts[i].node.thumbnail_resources[3].src,
                            thumbnail640x640 : posts[i].node.thumbnail_resources[4].src,
                            shortcode        : posts[i].node.shortcode,
                            isVideo          : posts[i].node.is_video

                        }
                        minhasPublicacoes.push(pup);
                    }
                    
                    // Objeto responsavel por pegar as informações do user.
                    let infoDados = {
                        username        : result.dadosUser.username,
                        qtdSeguindo     : result.dadosUser.follows.count,
                        qtdSeguidores   : result.dadosUser.followed_by.count,
                        biografia       : result.dadosUser.biography,
                        site            : result.dadosUser.external_url,
                        nome            : result.dadosUser.full_name,
                        contaVerificada : result.dadosUser.is_verified,
                        contaPrivada    : result.dadosUser.is_private,
                        fotoPerfilHd    : result.dadosUser.profile_pic_url_hd,
                        fotoPerfil      : result.dadosUser.profile_pic_url,
                        qtdPublicacoes  : result.dadosUser.media.count
                    }
                    meusDados.push(infoDados);
                    

                    instagram.publicacoes               = minhasPublicacoes;
                    instagram.dados                     = meusDados;
                    instagram.totalLikesInstagram       = somaLike;
                    instagram.totalComentariosInstagram = somaComentario;
                    instagram.mediaLikes                = mediaLikes;
                    instagram.mediaComentarios          = mediaComentarios;

                    instagram.save(function(err){
                        if(err){
                            res.send(err);
                            console.log("problema ao salvar o instagram");
                        }else{
                            // res.json({ posts});
                            console.log("instagram salvo");
                        }
                    })
                });
            });
         });
    // });  node schedule   
})
    
app.use('/api', router);

app.listen(port);
console.log('App rodando na porta: ' + port);