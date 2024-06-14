# Notes de cours

## Codes d'erreur

- 200 OK : Requête traitée avec succès.
- 201 Created : Requête traitée avec succès et création - d'une ressource (POST)
- 204 No Content : Requête traitée avec succès mais pas d'information à renvoyer (DELETE)
- 301 Moved Permanently : Ressource déplacée de façon permanente. Sert lors de la redirection d'une
page web
- 304 Not Modified : Ressource non modifiée
- 400 Bad Request : La syntaxe de la requête est erronée
- 401 Unauthorized : Une authentification est nécessaire pour accéder à la ressource
- 403 Forbidden : Le serveur a compris la requête mais refuse de l'exécuter
- 404 Not Found : Ressource non trouvée
- 405 Method Not Allowed : Méthode de requête non autorisée
- 500 Internal Server Error : Erreur interne du serveur



## voir notes de cours

/Applications/MAMP/htdocs/session_P24/techAvanceeProg


```js
/* Créer un dossier nommé 'dossier' */
fs.mkdir("dossier", (err) => {
if (err) {
console.error(err);
return;
}
console.log("Le dossier a été créé");
});


// Chemin vers
const path = require("path");
// Voir notes de cours 01
```


```js
// Gestion des url
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Prints #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Prints https://example.org/foo#baz 
```
