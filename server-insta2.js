var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/rest-api'); // connect to our database

var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var Instagram     = require('./app/models/instagram');
var schedule = require('node-schedule');

var webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
const controlFlow = webdriver.promise.controlFlow();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9080;        

var router = express.Router();              

router.use(function(req, res, next) {
    console.log('Algo esta acontecendo.');
    next(); 
});

// router.get('/instagram', function(req, res) {
//     // res.json({ message: 'hooray! welcome to our api!' });   
    
//     var rule = new schedule.RecurrenceRule();
//     rule.minute = new schedule.Range(0, 59, 1);
//     schedule.scheduleJob(rule, function(){
//         console.log(rule);
//         console.log('Fazendo a coleta do insta');


//         var driver = new webdriver.Builder()
//         .forBrowser('chrome')
//         .build();
    
//         driver.manage().window().maximize();
    
//         driver.get('https://www.instagram.com/contateste9915');
    
//         driver.executeScript(function() {
//             return window._sharedData.entry_data.ProfilePage[0].user;
//         }).then(resultado => {
//             let instagram = new Instagram();
//             instagram.dados = JSON.stringify(resultado);
            
//             res.json({resultado}); 
    
//             instagram.save(function(err){
//                 if(err){
//                     res.send(err);
//                 }else{
//                     res.json({ message: 'insta salvo!' });
//                 }
//             })
//         });

//     });
// });

router.route('/insta')  
.post(function(req, res) {
    // var rule = new schedule.RecurrenceRule();
    // rule.minute = new schedule.Range(0, 59, 1);
    // schedule.scheduleJob(rule, function(){
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
    
        driver.manage().window().maximize();
    
        driver.get('https://www.instagram.com/ativarinformatica');

        function getPrimeirosElementos () {
            
            let media = _sharedData.entry_data.ProfilePage[0].user.media;
            
            window.scrohla = { 
                totalPosts : media.count,
                posts : []
            };
        
            media.nodes.forEach( item => window.scrohla.posts.push({ node : item }) );

            console.log("window.scrohla.posts: ", window.scrohla.posts.length);
            
            var origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener("load", function() {
                    const response = JSON.parse(this.responseText);
                    if(response.data){
                        window.scrohla.posts = window.scrohla.posts.concat(response.data.user.edge_owner_to_timeline_media.edges);
                        console.log("window.scrohla.posts: ", window.scrohla.posts.length);
                    }
                });
                origOpen.apply(this, arguments);
            };
        
            return {
                totalPosts : window.scrohla.totalPosts,
                tamanhoArrayJaPopulado: window.scrohla.posts.length
            }
        };

        function scroll(){

            // controlFlow.execute( () => console.log(` srolling...`) ); 

            // driver.executeScript(function(){
            //     window.scrollTo(0, 500000);
            // });

            
            // controlFlow.execute( () => console.log(` sleep...`) );
            // driver.sleep(5000); 
           
           
             // controlFlow.execute( () =>  {
            //     console.log("teste flow ...");
            //     res.json({resultado})
            // }); 
           
            driver.sleep(2000); 
            driver.executeScript(function(){
                window.scrollTo(0, 500000);
            });
            driver.sleep(2000); 
            

            // controlFlow.execute( () => console.log(` executeScript...`) );
            driver.executeScript(function(){
                return {
                    totalPosts : window.scrohla.totalPosts,
                    tamanhoArrayJaPopulado: window.scrohla.posts.length
                }
            }).then(resultado => {
                // controlFlow.execute( () => console.log(` resultado ${JSON.stringify(resultado)}`) );
                console.log(JSON.stringify(resultado));
                if(resultado.totalPosts > resultado.tamanhoArrayJaPopulado){
                    // console.log("resultado.totalPosts ",resultado.totalPosts);
                    // console.log("resultado.tamanhoArrayJaPopulado ", resultado.tamanhoArrayJaPopulado);
                    scroll();
                }
            });

        };

        function getPosts(){
            return driver.executeScript(function(){
                return window.scrohla.posts;
            });
        };
        
        //FECHANDO A BARRA DE FOOTER.
        let spanBranco = ('//span[@class="_lilm5"]');
        let spanPreto = ('//section[@class="_cqw45 _2pnef"]//div[@class="_mtajp"]//a[@class="_5gt5u coreSpriteDismissLarge"]//span[@class="_8scx2"]');
        let carregarMais = ('//a[contains(text(), "Carregar mais")]');

        driver.findElement(By.xpath(spanBranco)).then(el => {
            driver.sleep(5000);
            el.click();
            driver.sleep(5000);
            driver.findElement(By.xpath(carregarMais)).click();
        }).catch(error => {
            driver.sleep(5000);
            driver.findElement(By.xpath(spanPreto)).click();
            driver.findElement(By.xpath(carregarMais)).click();
        });

             

    
        driver.executeScript(getPrimeirosElementos).then(resultado => {
        
        //    console.log(resultado.totalDePosts);
        //    console.log(resultado.tamanhoArrayJaPopulado);
            
        
            if(resultado.tamanhoArrayJaPopulado < resultado.totalPosts){
                console.log("resultado 1: ", resultado);
                scroll();
            }

            // driver.controlFlow.executeScript();
            //NAO TA CHEGANDO AQUI PQQ?
            // driver.executeScript(getPosts).then(resultadojson => {
            //     console.log("total array capturado: " + resultadojson.length);
            // });
            
            
            // let instagram = new Instagram();
            // instagram.hora_coleta = new Date();
            // instagram.user = resultado.username;
            // instagram.dados = JSON.stringify(resultado);

            // getPosts().then( resultado => res.json( { "tamanho" : resultado.length}))
                
            // controlFlow.execute( () =>  {
            //     console.log("teste flow ...");
            //     res.json({resultado})
            // }); 
            
    
            // instagram.save(function(err){
            //     if(err){
            //         res.send(err);
            //         console.log("problema ao salvar o instagram");
            //     }else{
            //         res.json({ message: 'insta salvo!' });
            //         console.log("instagram salvo");
            //     }
            // })
        });  
        
        
        
    // });     
})
    
app.use('/api', router);

app.listen(port);
console.log('App rodando na porta: ' + port);