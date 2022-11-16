const express = require('express');
const cors = require('cors')
const fs = require('fs');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("ngrok-skip-browser-warning", "5");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

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


//RAZAS
app.get("/races", (req, res) => {
    const data = fs.readFileSync("./data/races.json", "utf-8");
    res.send(JSON.parse(data));
});

app.get("/races/:nameRace", (req, res) => {
    const nameRace = req.params['nameRace'];
    const race = findObjectByName("races", nameRace);
    res.json(race);
});


//PROFESIONES
app.get("/professions", (req, res) => {
    const data = fs.readFileSync("./data/professions.json", "utf-8");
    res.send(JSON.parse(data));
});

app.get("/professions/:nameProfession", (req, res) => {
    const nameProfession = req.params['nameProfession'];
    const profession = findObjectByName("professions", nameProfession);
    res.json(profession);
});

//INICIAR SESION
app.post("/iniciar-sesion", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const playerList = JSON.parse(fs.readFileSync("./data/players/players.json", "utf-8"));

    for (let player of playerList) {
        if (player.username === username) {
            if (player.password === password) {
                return res.json({ status: "Sesion iniciada", username: username });
            } else {
                return res.json({ error: "Contraseña incorrecta" });
            }
        }
    }

    playerList.push({ username: username, password: password });
    fs.writeFileSync("./data/players/players.json", JSON.stringify(playerList, null, 2));
    fs.mkdirSync(`./data/players/${username}`);
    fs.writeFileSync(`./data/players/${username}/characters.json`, "[]");
    res.json({ status: "Ususario registrado", username: username });
});

//BUSCAR PERSONAJES POR NOMBRE DE USUARIO
app.get("/characters/:username", (req, res) => {
    const username = req.params['username'];
    const characters = JSON.parse(fs.readFileSync(`./data/players/${username}/characters.json`));
    res.json(characters);
});

//CREAR PERSONAJE
function getSkillsCharacter(character, professionSkills) {
    const skills = JSON.parse(fs.readFileSync("./data/skills.json"));
    const characterSkills = [];

    for (let skill of skills) {
        skill.profession = professionSkills.includes(skill.name);
        skill.value = 0;
        characterSkills.push(skill);
    }

    return characterSkills;
}

function getCombatSkillsCharacter(character, professionSkills) {
    const combatSkills = JSON.parse(fs.readFileSync("./data/combatSkills.json"));
    const characterCombatSkills = [];

    for (let combatSkill of combatSkills) {
        combatSkill.profession = professionSkills.includes(combatSkill.name);
        combatSkill.value = 0;
        characterCombatSkills.push(combatSkill);
    }

    return characterCombatSkills;
}

app.post("/new-character/:username", (req, res) => {
    const username = req.params['username'];
    const character = req.body;

    //Se guarda el nombre del personaje en el JSON de la carpeta del jugador
    const characters = JSON.parse(fs.readFileSync(`./data/players/${username}/characters.json`, "utf-8"));
    characters.push({ name: character.name });
    fs.writeFileSync(`./data/players/${username}/characters.json`, JSON.stringify(characters, null, 2));


    //Raza y profesion del personaje
    const race = findObjectByName("races", character.race);
    const profession = findObjectByName("professions", character.profession);


    //Se aplican las características al personaje
    character.features = race.features;


    //Se aplican las habilidades al personaje, siendo true las de profesion
    character.skills = getSkillsCharacter(character, profession.skills);
    character.combatSkills = getCombatSkillsCharacter(character, profession.skills);


    //Se asignan los rasgos de la raza y profesion
    console.log(profession.traits);
    character.traits = race.special.concat(profession.traits);

    //OTROS
    character.weapons = [];
    character.equipments = [];

    //Se aplica la protección y heridas al personaje, iniciando sin protección
    character.armor = findObjectByName("armors", "Sin protección");
    character.injuryStatement = { maxInjuries: (race.injury + character.features.find(feature => feature.name === "Fortaleza").value), currentInjuries: 0, criticalInjuries: 0 };
    character.tensionStatement = { maxTension: (race.tension + character.features.find(feature => feature.name === "Voluntad").value), currentTension: 0 };


    fs.writeFileSync(`./data/players/${username}/${character.name}.json`, JSON.stringify(character, null, 2));
    res.json({ status: "Personaje creado" });
});

//SELECCIONAR PERSONAJE POR NOMBRE Y POR USUARIO
app.get("/:username/:nameCharacter", (req, res) => {
    const username = req.params['username'];
    const nameCharacter = req.params['nameCharacter'];

    const character = JSON.parse(fs.readFileSync(`./data/players/${username}/${nameCharacter}.json`, "utf-8"));
    res.json(character);
});

/* app.use(cors()); */

const server = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
});

server.on("error", error => console.log(`Error en servidor: ${error}`));