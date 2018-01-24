
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
    
        driver.get('https://www.instagram.com');

        let login = ('//p[@class="_g9ean"]//a');
        driver.sleep(2000);
        driver.findElement(By.xpath(login)).click();
        let user = ('//input[@name="username"]')
        driver.sleep(1000);
        let senha = ('//input[@type="password"]');
        // driver.findElement(By.xpath(user)).sendKeys("rafinhagsantos");
        driver.findElement(By.xpath(user)).sendKeys("contateste9915");
        driver.sleep(1000);
        // driver.findElement(By.xpath(senha)).sendKeys("Rrg018nm*");
        driver.findElement(By.xpath(senha)).sendKeys("99151767");
        driver.sleep(1000);
        let botao = ('//button[@class="_qv64e _gexxb _4tgw8 _njrw0"]');
        driver.sleep(1000);
        driver.findElement(By.xpath(botao)).click();
        driver.sleep(1000);
        let ativar = ('//a[@class="_f89xq"]');
        driver.sleep(1000);
        driver.findElement(By.xpath(ativar)).click();
        
        
        function populatePosts () {    
            const media = _sharedData.entry_data.ProfilePage[0].user.media;
            const dadosUser = window._sharedData.entry_data.ProfilePage[0].user;
            
            
            window.scrohla = { 
                totalPosts : media.count, 
                posts : [],
                dadosUser : dadosUser
            };
        
            media.nodes.forEach( item => window.scrohla.posts.push({ node : item }) );

            //console.log("window.scrohla.posts: ", window.scrohla.posts.length);
            
            var origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener("load", function() {
                    const response = JSON.parse(this.responseText);
                    if(response.data){
                        window.scrohla.posts = window.scrohla.posts.concat(response.data.user.edge_owner_to_timeline_media.edges);
                        // console.log("window.scrohla.posts: ", window.scrohla.posts.length);
                    }
                });
                origOpen.apply(this, arguments);
            };
        
            return {
                totalPosts : window.scrohla.totalPosts,
                totalFound : window.scrohla.posts.length,
                dadosUser : window.scrohla.dadosUser
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
            driver.sleep(5000); 
            

            // controlFlow.execute( () => console.log(` executeScript...`) );
            driver.executeScript(function(){
                return {
                    totalPosts : window.scrohla.totalPosts, 
                    totalFound : window.scrohla.posts.length
                };
            }).then(result => {
                // controlFlow.execute( () => console.log(` resultado ${JSON.stringify(resultado)}`) );
                console.log(JSON.stringify(result));
                if(result.totalPosts > result.totalFound){
                    // console.log("resultado.totalPosts ",resultado.totalPosts);
                    // console.log("resultado.tamanhoArrayJaPopulado ", resultado.tamanhoArrayJaPopulado);
                    scroll();
                }
                console.log(`Pegando ${result.totalFound} de ${result.totalPosts}`);
            });

        };

        function getPosts(){
            return driver.executeScript(function(){
                return window.scrohla.posts;
            });
        };

        function getDadosUser(){
            return driver.executeScript(function(){
                return window.scrohla.dadosUser;
            });
        };
      
       
        //FECHANDO A BARRA DE FOOTER.
        /*let spanBranco = ('//span[@class="_lilm5"]');
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
        });*/

             

    
        driver.executeScript(populatePosts).then(result => {

            if(result.totalFound < result.totalPosts ){
                console.log("resultado 1: ", result);
                //console.log("dados user:" , JSON.stringify(result.dadosUser));
                scroll();
            }

            // getDadosUser().then(userinfo => {
            //     console.log("IIIHAHAAAAAAA", JSON.stringify(userinfo));

            //     let instagram = new Instagram();
                
            //     // instagram.user = resultado.username;
            //     instagram.dados = userinfo;

            //     instagram.save(function(err){
            //         if(err){
            //             res.send(err);
            //             console.log("problema ao salvar o instagram");
            //         }else{
            //             //res.json({ posts});
            //             console.log("instagram salvo 2");
            //         }
            //     })
            // });

            getPosts().then(posts => { 
               console.log(posts[0].node.caption);

                // console.log("AEEEEEEEEEEEEEEEEE TO AQUIIIIIIII", JSON.stringify(getDadosUser()));

                let instagram = new Instagram();
                instagram.hora_coleta = new Date();
                // instagram.user = resultado.username;
                instagram.publicacoes = posts;
                instagram.dados = getDadosUser();

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



          
            // driver.executeScript(getPosts).then(final  => {
            //     console.log("chequi aqui");
            //     console.log(final);
            // });


            // driver.controlFlow.executeScript();
            //NAO TA CHEGANDO AQUI PQQ?
            // driver.executeScript(getPosts).then(resultadojson => {
            //     console.log("total array capturado: " + resultadojson.length);
            // });
            
            

            // let instagram = new Instagram();
            // instagram.hora_coleta = new Date();
            // instagram.user = resultado.username;
            // instagram.dados = JSON.stringify(posts);

            // getPosts().then( resultado => res.json( { "tamanho" : result}))
                
            // controlFlow.execute( () =>  {
            //     driver.executeScript(getPosts).then(resultadojson => {
            //     console.log("total array capturado: " + resultadojson);
            // });
            // }); 
            
            //console.log(result);
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