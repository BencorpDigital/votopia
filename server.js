const express = require("express");
const next = require("next");


const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Ajouter une route pour les requêtes d'API d'authentification
  server.use('/api/auth', (req, res) => {
    // Traiter les requêtes d'authentification ici
    // Vous pouvez utiliser un middleware ou un routeur pour gérer les différentes routes d'authentification
    return handle(req, res);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });
  
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
});

