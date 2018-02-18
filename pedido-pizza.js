var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');

var webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9080;        

var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
    
        //Maximizando a página.
        driver.manage().window().maximize();
        
        //Acessando a página OY Pizza.
        driver.get('http://www.oypizza.com.br/pedir-agora.html');

        //Fazendo o login.
        let loginEmail = ('//input[@id="login_email"]');
        driver.findElement(By.xpath(loginEmail)).sendKeys("dalsassokaroliny@gmail.com");
        let loginSenha = ('//input[@id="login_senha"]');
        driver.findElement(By.xpath(loginSenha)).sendKeys("passatempo");
        let btnEntrar  = ('//input[@class="botn_logn_pedr"]');
        driver.findElement(By.xpath(btnEntrar)).click();

        //Escolhendo a quantidade de sabores da pizza.
        driver.sleep(1000);
        let qtdSabores = driver.findElement(By.css('#sabr > option:nth-child(4)')).click();

        //Escolhendo a massa da pizza salgada.
        driver.sleep(1000);
        let tipoMassa = driver.findElement(By.css('#mass > option:nth-child(2)')).click();

        //Próximo passo.
        let btnProximoPasso = ('//span[@class="botn_prox_pass"]');
        driver.findElement(By.xpath(btnProximoPasso)).click();

        //Escolhendo os sabores.
        driver.sleep(1000);
        let file4Queijos = driver.findElement(By.css('#sabr_1 > option:nth-child(35)')).click();
        //driver.sleep(1000);
        let frangoSupreme = driver.findElement(By.css('#sabr_2 > option:nth-child(38)')).click();
        //driver.sleep(1000);
        let coracao = driver.findElement(By.css('#sabr_3 > option:nth-child(32)')).click();
        
        //Pedindo pizza doce.
        driver.sleep(1000);
        let btnPizzaDoce = ('//a[contains(text(), "PEÇA SUA PIZZA DOCE")]');
        driver.findElement(By.xpath(btnPizzaDoce)).click();

        //Escolhendo o tamanho da pizza doce (pequeno).
        driver.sleep(1000);
        driver.findElement(By.id("tamn_1")).click();

        //Escolhendo a massa da pizza doce.
        driver.sleep(1000);
        let tipoMassaDoce = driver.findElement(By.css('#mass > option:nth-child(2)')).click();

        //Próximo passo pizza doce.
        let btnProximoPassoDoce = ('//span[@class="botn_prox_pass"]');
        driver.findElement(By.xpath(btnProximoPassoDoce)).click();

        //Escolhendo os sabores doce.
        driver.sleep(1000);
        let chocolate = driver.findElement(By.css('#sabr_1 > option:nth-child(51)')).click();

        //Próximo passo pizza doce 2.
        driver.sleep(1000);
        let btnProximoPassoDoce2 = ('//div[@class="botn_prox_pass left"]');
        driver.findElement(By.xpath(btnProximoPassoDoce2)).click();

        //Pedindo refri (coca)
        driver.sleep(1000);
        driver.findElement(By.id("prdt_4")).click();

        //Próximo passo refri
        driver.sleep(1000);
        let btnProximoPassoRefri = ('//div[@class="botn_prox_pass left"]');
        driver.findElement(By.xpath(btnProximoPassoRefri)).click();

app.listen(port);
console.log('App rodando na porta: ' + port);