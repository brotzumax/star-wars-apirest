const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function findObjectByName(fileName, objectName) {
    const data = JSON.parse(fs.readFileSync(`./data/${fileName}.json`));
    const object = data.find(object => object.name === objectName);
    return object;
}

app.get("/weapons", (req, res) => {
    const data = fs.readFileSync("./data/weapons.json", "utf-8");
    res.send(JSON.parse(data));
});

app.get("/weapon/:nameWeapon", (req, res) => {
    const nameWeapon = req.params['nameWeapon'];
    const weapon = findObjectByName("weapons", nameWeapon);
    res.send(weapon);
});

app.get("/armors", (req, res) => {
    const data = fs.readFileSync("./data/armors.json", "utf-8");
    res.send(JSON.parse(data));
});

app.get("/armor/:nameArmor", (req, res) => {
    const nameArmor = req.params['nameArmor'];
    const armor = findObjectByName("armors", nameArmor);
    res.send(armor);
});

app.get("/equipment", (req, res) => {
    const data = fs.readFileSync("./data/equipment.json", "utf-8");
    res.send(JSON.parse(data));
});

app.get("/equipment/:nameEquipment", (req, res) => {
    const nameEquipment = req.params['nameEquipment'];
    const equipment = findObjectByName("equipment", nameEquipment);
    res.send(equipment);
});

app.get("/races", (req, res) => {
    const data = fs.readFileSync("./data/races.json", "utf-8");
    res.send(JSON.parse(data));
});

app.get("/races/:nameRace", (req, res) => {
    const nameRace = req.params['nameRace'];
    const race = findObjectByName("races", nameRace);
    res.send(race);
});


//CREAR PERSONAJE
app.post("/character", (req, res) => {
    const character = req.body;
    fs.writeFileSync(`./data/characters/${character.characterName}.json`, JSON.stringify(character, null, 2));
    res.send(character);
});

const server = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
});

server.on("error", error => console.log(`Error en servidor: ${error}`));