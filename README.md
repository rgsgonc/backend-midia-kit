# Backend Mídia Kit

* Para realizar a coleta no instagram você deve baixar o projeto.
* <b> <em> OBS: </em> Foi commitado a pasta node_modules da digitro, desta forma apagar todas as dependências e instalar novamente. </b>
* Ir até o arquivo server-insta2.js e alterar o instagram que deseja fazer a coleta, conforme exemplo abaixo.

```
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
driver.get('https://www.instagram.com/kadalsasso'); - ALTERAR AQUI O INSTAGRAM A SER COLETADO.
```

* Após alterar o instagram a ser coletado executar ``` node server-insta2.js```
* Abrir o aplicativo POSTMAN e colocar na URL ``` http://localhost:9080/api/insta ``` , Method: POST.

# Base de dados

A base de dados utilizada na aplicação é MongoDB.
* Nome da base: rest-api
* Collection: instagrams

# Coleta Youtube

* Clique no botão para fazer login <br/>
``` $x ('//paper-button[@class="style-scope ytd-button-renderer style-brand"]//yt-formatted-string[contains(text(), "Fazer login")]')[0].click(); ```
