//? Importando librerias
const express = require('express');
const jimp = require('jimp')
const fs = require('fs');
const yargs = require('yargs');
const axios = require('axios');
const app = express();
const pto = 3000;


//? configurando carpeta estatica
app.use(express.static('static'));

//? procesar las imagenes
app.get('/procesar', async(req, res)=>{
    //? guardar la foto en una variable
    let archivo = req.query.foto;
    const captura = await jimp.read(archivo);
    await captura.resize(420, jimp.AUTO).rgba(false).quality(65).grayscale().writeAsync('img/imagen.jpg')

    fs.readFile('img/imagen.jpg', (err, captura) => {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' })
        res.end(captura)
    })
});


//? Asignando rutas
app.get('/pokemones', async(req, res) => {
    const datos = await axios.get("https://pokeapi.co/api/v2/pokemon/");
    const pokemones = datos.data.results;
    
   Promise.all([

        axios.get(pokemones[0].url),
        axios.get(pokemones[1].url),
        axios.get(pokemones[2].url),
        axios.get(pokemones[3].url),
        axios.get(pokemones[4].url),
        axios.get(pokemones[5].url),
        axios.get(pokemones[6].url),
        axios.get(pokemones[7].url),
        axios.get(pokemones[8].url),
        axios.get(pokemones[9].url),
        axios.get(pokemones[10].url),
        axios.get(pokemones[11].url),
        axios.get(pokemones[12].url),
        axios.get(pokemones[13].url),
        axios.get(pokemones[14].url)
    ]).then(function(infoPoke) {
        
        const listPoke = []

        for (pokemon of infoPoke) {

            listPoke.push({
                
                img: pokemon.data.sprites.front_default,
                nombre: pokemon.data.name
            })
        }

        res.send(listPoke);
    }).catch((error) => {
        console.log('Error', error);
    })


});

//? configurando comando yargs
yargs.command(
    'start',
    'comando para correr el servidor', {
        clave: {
            describe: 'clave secreta para iniciar el servidor',
            demand: true,
            alias: 'p'
        }
    },
    function(args) {

        if (args.clave != '222') {
            console.log('clave incorrecta')
            return 1;
        };

        app.listen(pto, () => {
            console.log(`servidor corriendo en el puerto ${pto}`);
        });

    }
).help().argv;
