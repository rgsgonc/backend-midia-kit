# backend-midia-kit

para funcionar em casa apagar todas as dependencias e instalar de novo

```
let lista = [];
var origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    console.log('request started!');
    this.addEventListener('load', function() {
       
		console.log('request completed!');
        console.log(this.readyState); //will always be 4 (ajax is completed successfully)

        const resObject = JSON.parse(this.responseText);
        if(resObject.data){
			lista = lista.concat(resObject.data.user.edge_owner_to_timeline_media.edges);
        }

        //lista.push(JSON.parse(this.responseText));  
          //console.log(this.responseText); //whatever the response was
    });
    origOpen.apply(this, arguments);
};
```
