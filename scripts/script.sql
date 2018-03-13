CREATE TABLE `competencia`
(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(100),
	PRIMARY KEY(`id`)
);

CREATE TABLE `votos`
(
	`id` int (11) NOT NULL AUTO_INCREMENT,
	`competencia_id` int(11),
	`pelicula_id`  int (11) unsigned,
	`votos` int(11),
	FOREIGN KEY(`competencia_id`) REFERENCES `competencia`(`id`),
	FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula`(`id`),
	PRIMARY KEY(`id`)
);

INSERT INTO `competencia`(nombre) VALUES ('¿Cuál es la mejor película?'),('¿Cual película no mirarias?'),('¿Cuál película es más rara?'),('¿Cuál película eligira Steve Jobs?'),('¿Con cual de las siguente películas te quedarias dormido?'); 
ALTER TABLE competencia  ADD COLUMN genero_id int(11) unsigned;
ALTER TABLE competencia add foreign key (genero_id) REFERENCES genero(id);
ALTER TABLE competencia  ADD COLUMN director_id int(11) unsigned;
ALTER TABLE competencia add foreign key (director_id) REFERENCES director(id);
ALTER TABLE competencia  ADD COLUMN actor_id int(11) unsigned;
ALTER TABLE competencia add foreign key (actor_id) REFERENCES actor(id);