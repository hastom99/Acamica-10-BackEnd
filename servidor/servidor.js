require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controladorCompetencias = require('./controladores/controladorCompetencias');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias',controladorCompetencias.obtenerCompetencias);

app.get('/competencias/:id',controladorCompetencias.obtenerCompetencia);

app.get('/generos',controladorCompetencias.obtenerGenero);

app.get('/directores',controladorCompetencias.obtenerDirectores);

app.get('/actores/',controladorCompetencias.obtenerActores);
//app.get('/generos',controladorPeliculas.devolverGeneros);
app.post('/competencias',controladorCompetencias.crearUnaCompetencia);

app.delete('/competencias/:id',controladorCompetencias.borrarCompetencia);

app.delete('/competencias/:id/votos',controladorCompetencias.ReiniciarVotosCompetencia)

app.get('/competencias/:id/peliculas',controladorCompetencias.obtenerOpciones);

app.post('/competencias/:id/voto',controladorCompetencias.votoPelicula);

app.get('/competencias/:id/resultados',controladorCompetencias.obtenerResultados);

app.put('/competencias/:id',controladorCompetencias.editarCompetencia);

app.listen(process.env.EXPRESS_PORT, function () {
    console.log("Escuchando en " + `http://localhost:${process.env.EXPRESS_PORT}/`);
});

