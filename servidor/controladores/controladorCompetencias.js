var con = require('../lib/conexionbd');

function obtenerCompetencias(req,res) 
{
	var sql = 'select * from competencia';
	con.query(sql,function(error,resultado,fields)
	{
		if(error)
		{
            return res.status(500).send("Hubo un error en el servidor");	//REVISAR
		}

		res.send(JSON.stringify(resultado));
	});
}
function obtenerOpciones(req,res)
{
	var id = req.params.id;
	con.query('select * from competencia where id = ?',[id],function(error,resultado,fields)
	{
		if(error) return res.status(500).send(error);
		if(resultado.length == 0)
		{	
			return res.status(404).send("Competencia no existente");
		}
		var idGenero = resultado[0].genero_id;
		var idDirector = resultado[0].director_id;
		var idActor = resultado[0].actor_id;
		var cont=0;
		var sql = 'SELECT DISTINCT pelicula.id,pelicula.poster,pelicula.titulo FROM pelicula LEFT JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id LEFT JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id WHERE 1 = 1';
		var sqlGenero = idGenero ? ' AND pelicula.genero_id = '  + idGenero : '';
		var sqlDirector = idDirector ? ' AND director_pelicula.director_id = '  + idDirector : '';
		var sqlActor = idActor ? ' AND actor_pelicula.actor_id = '  + idActor : '';
		sql = sql + sqlGenero + sqlDirector + sqlActor;
		con.query(sql,function(error,resultado,fields)
		{
			var primeraPelicula = randomPeliculas(null,resultado.length);
			var segundPelicula = randomPeliculas(primeraPelicula,resultado.length);
			var arrayFinalPelicula = [resultado[primeraPelicula],resultado[segundPelicula]];
			var respuesta = {
				'peliculas':arrayFinalPelicula
			};
			res.send(JSON.stringify(respuesta));
		});
	});
}

function randomPeliculas(noRepetir, maxNumero) {
	do
	{
	var numero=Math.floor(Math.random() * maxNumero); 
	}while(numero == noRepetir);
	return numero;
}

function votoPelicula(req,res)
{
	//AGREGAR CONTROL DE STATUS Y ERROR
	var idCompetencia = req.params.id;
	var idPelicula = req.body.idPelicula;
	var existeVotoPelicula;
	var objetoCompetencia = [idCompetencia,idPelicula,1];
	var self = this;
	var sql = 'select * from competencia where id = ' + idCompetencia;  
	con.query(sql,function(error,resultado,fields)
	{
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		if(resultado.length==0)
		{
			return res.status(404).send("Competencia no encontrada");
		}
		sql = 'select * from votos where competencia_id = ' +idCompetencia +' AND pelicula_id= '+idPelicula;
		con.query(sql,function(error,resultado,fields)
		{
			var sql;
			if(error)
			{
				return res.status(500).send("Error en el servidor");
			}
			if(resultado.length ==0)
			{
		 		sql = 'INSERT INTO votos(competencia_id,pelicula_id,votos) VALUES ('+objetoCompetencia+')';
			}
			else
			{	
				sql = 'UPDATE votos  SET votos = votos + 1 where competencia_id= '+ idCompetencia +' AND pelicula_id= '+idPelicula;
			}
			con.query(sql,function(error,resultado,fields)
			{
		 		if(error)
		 		{
		 			return res.status(500).send("Error en el servidor");
		 		}
		 		res.send(JSON.stringify(''));	
			});
		});
	});
}

function obtenerResultados (req,res)
{
	var idCompetencia = req.params.id;
	var sql = 'select * from competencia where id = '+ idCompetencia;
	con.query(sql,function(error,resultado,fields)
	{
		if(error)
		{
			return res.status(500).send("Erro en el servidor");
		}
		if(resultado.length==0)
		{
			return res.status(404).send("No existe esa competencia");
		}
		sql = 'select * from votos join competencia on competencia_id = competencia.id join pelicula on pelicula_id = pelicula.id where competencia_id = '+ idCompetencia +' order by votos desc limit 0,3';	
		con.query(sql,function(error,resultado,fields)
		{
			if(resultado.length==0)
			{
				return res.status(404).send("no existe ninguna pelicula en esa competencia");
			}
			if(error)
			{
				return res.status(500).send("Error en el servidor");
			}
			var respuesta = {
				'competencia':resultado[0].nombre,
				'resultados' : resultado
			};
			res.send(JSON.stringify(respuesta));
		});
	});
}
function crearUnaCompetencia(req,res)
{
	var idGenero = req.body.genero;
	var idDirector = req.body.director;
	var idActor = req.body.actor;
	var nombre = req.body.nombre;
	var sql= "select * from competencia where nombre = '"+nombre+"'";
	con.query(sql,function(error,resultado,fields)
	{
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		if(resultado.length > 0)
		{
			return res.status(422).send("Ese nombre ya existe");
		}
		insertarPelicula(nombre,idGenero,idDirector,idActor,res);
	});
	

}

function insertarPelicula(nombre,idGenero,idDirector,idActor,res)
{
	var arrayParametros=[];
	var sqlGenero = (idGenero!=0) ? ' AND pelicula.genero_id = '  + idGenero : ' ';
	var sqlActor = (idActor!=0) ? ' AND actor_pelicula.actor_id = '  + idActor : '';
	var sqlDirector = (idDirector!=0) ? ' AND director_pelicula.director_id = ' + idDirector : '';
	console.log(sqlGenero);
	var sql = 'SELECT DISTINCT pelicula.id FROM pelicula LEFT JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id LEFT JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id WHERE 1 = 1';
	sql = sql + sqlGenero + sqlActor + sqlDirector;
	console.log(sql);
	con.query(sql,function(error,resultado,fields) //VEO SI HAY 2 PELICULAS CON ESA COMBINACIÓN
	{
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		console.log(resultado.length +"HOLAAA");
		if(resultado.length <2)
		{
			return res.status(422).send('No se encuentra en la base de datos 2 peliculas con esos parametros');
		}
		idGenero  = (idGenero!=0) ? idGenero : 'null';
		idDirector  = (idDirector!=0) ? idDirector : 'null';
		idActor  = (idActor!=0) ? idActor : 'null';
		var arrayCompetencia= ["'"+nombre+"'",idGenero,idDirector,idActor];
		sql = "INSERT INTO competencia(nombre,genero_id,director_id,actor_id) VALUES ("+arrayCompetencia+")";
		con.query(sql,function(error,resultado,fields)
		{
			if(error)
			{
				return res.status(500).send("Error en el servidor");
			}
			return res.status(220).send();
		});
	});
}

function borrarCompetencia(req,res)
{
	var idCompetencia= req.params.id;
	var sql = 'select id from competencia where id = '+idCompetencia;
	con.query(sql,function(error,resultado,fields)
	{
		if(resultado.length==0)
		{
			return res.status(404).send("No existe esa competencia");
		}
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		sql = 'delete from competencia where id= '+idCompetencia;
		con.query(sql,function(error,resultado,fields)
		{
			if(error)
			{
				return res.status(500).send("Error en el servidor");
			}
			return res.status(220).send();
		});
	});
	
}

function obtenerCompetencia (req,res)
{
	var idCompetencia = req.params.id;
	var sql = 'select id from competencia where id = '+idCompetencia;
	con.query(sql,function(error,resultado,fields)
	{
		if(resultado.length==0)
		{
			return res.status(404).send("No existe esa competencia");
		}
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		sql = 'select c.nombre,d.nombre as director_nombre,ac.nombre as actor_nombre ,g.nombre as genero_nombre from(((competencia as c left join director as d on c.director_id=d.id) left join actor as ac on c.actor_id= ac.id) left join genero as g on c.genero_id = g.id) where c.id = ' + idCompetencia;
		con.query(sql,function(error,resultado,fields)
		{
		res.send(JSON.stringify(resultado[0]));
		});
	});
}
function obtenerGenero(req,res)
{
	var sql = 'select * from genero';
	con.query(sql,function(error,resultado,fields)
	{
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		res.send(JSON.stringify(resultado));
	});
}

function obtenerDirectores(req,res)
{
	//solo es necesario obtener los directores que tienen al menos 2 peliculas para realizar el "versus"
	var sql = 'select distinct director_id, director.nombre from director_pelicula join director on director_id = director.id where director_id In ( SELECT director_id from director_pelicula as Tmp GROUP BY director_id HAVING Count(*)>1)';
	con.query(sql,function(error,resultado,fields)
	{
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		res.send(JSON.stringify(resultado));
	});
}

function obtenerActores(req,res)
{
	//solo es necesario obtener los actores que tienen al menos 2 peliculas para realizar el "versus"
	var sql = 'select distinct actor_id, actor.nombre from actor_pelicula join actor on actor_id = actor.id where actor_id In ( SELECT actor_id from actor_pelicula as Tmp GROUP BY actor_id HAVING Count(*)>1)';
	con.query(sql,function(error,resultado,fields)
	{
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		res.send(JSON.stringify(resultado));
	});
}

function editarCompetencia(req,res) {
	var nombre = req.body.nombre;
	var idCompetencia = req.params.id;
	var sql = 'select id from competencia where id = '+idCompetencia;
	con.query(sql,function(error,resultado,fields)
	{
		if(resultado.length==0)
		{
			return res.status(404).send("No existe esa competencia");
		}
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		sql = "select nombre from competencia where nombre = '"+nombre+"'";
		con.query(sql,function(error,resultado,fields)
		{
			if(error)
			{
				return res.status(500).send("Error en el servidor");
			}
			if(resultado.length>0)
			{
				return res.status(422).send("Ese nombre ya existe para otra competencia");
			}
			sql = "UPDATE competencia SET nombre = '"+ nombre+"'  where id = "+idCompetencia;
			con.query(sql,function(error,resultado,fields){
				if(error)
				{
				return res.status(500).send('Error en el servidor');
				}	
				return res.status(220).send();
			});
		});
	});
}

function ReiniciarVotosCompetencia(req,res)
{
	var idCompetencia = req.params.id;
	var sql = 'select id from competencia where id = '+idCompetencia;
	con.query(sql,function(error,resultado,fields)
	{
		if(resultado.length==0)
		{
			return res.status(404).send("No existe esa competencia");
		}
		if(error)
		{
			return res.status(500).send("Error en el servidor");
		}
		sql = 'DELETE from votos where competencia_id = '+idCompetencia;
		con.query(sql,function(error,resultado,fields)
		{
			if(error)
			{
				return res.status(500).send("Error en el servidor");
			}
			return res.status(220).send();
		});
	});
}

module.exports = {
	obtenerCompetencias:obtenerCompetencias,
	obtenerOpciones:obtenerOpciones,
	votoPelicula: votoPelicula,
	obtenerResultados:obtenerResultados,
	crearUnaCompetencia:crearUnaCompetencia,
	borrarCompetencia:borrarCompetencia,
	obtenerCompetencia:obtenerCompetencia,
	obtenerGenero:obtenerGenero,
	obtenerDirectores:obtenerDirectores,
	obtenerActores:obtenerActores,
	editarCompetencia:editarCompetencia,
	ReiniciarVotosCompetencia:ReiniciarVotosCompetencia

};