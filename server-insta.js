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
    var rule = new schedule.RecurrenceRule();
    rule.minute = new schedule.Range(0, 59, 1);
    schedule.scheduleJob(rule, function(){
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
    
        driver.manage().window().maximize();
    
        driver.get('https://www.instagram.com/sofhiakowalski');
    
        driver.executeScript(function() {
            return window._sharedData.entry_data.ProfilePage[0].user;
        }).then(resultado => {
            let instagram = new Instagram();
            instagram.hora_coleta = new Date();
            instagram.user = resultado.username;
            instagram.dados = JSON.stringify(resultado);
            
            res.json({resultado}); 
    
            instagram.save(function(err){
                if(err){
                    res.send(err);
                    console.log("problema ao salvar o instagram");
                }else{
                    res.json({ message: 'insta salvo!' });
                    console.log("instagram salvo");
                }
            })
        });   
    });     
})
    
app.use('/api', router);

app.listen(port);
console.log('App rodando na porta: ' + port);