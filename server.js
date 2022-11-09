const express = require('express');


const app = express();

app.get("/", (req, res) => {
    res.send("Hola :)");
});

const server = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
});

server.on("error", error => console.log(`Error en servidor: ${error}`));