const express = require('express');
const fs = require('fs');

const app = express();

function findWeapon(name){
    const data = JSON.parse(fs.readFileSync("./data/weapons.json"));
    const weapon = data.find(weapon => weapon.name === name);
    return weapon;
}

app.get("/weapons", (req, res) => {
    const data = fs.readFileSync("./data/weapons.json", "utf-8");
    res.send(JSON.parse(data));
});

app.get("/weapon/:nameWeapon", (req, res) => {
    const nameWeapon = req.params['nameWeapon'];
    const weapon = findWeapon(nameWeapon);
    res.send(weapon);
});

const server = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
});

server.on("error", error => console.log(`Error en servidor: ${error}`));