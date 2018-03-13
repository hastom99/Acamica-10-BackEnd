# Elige la imagen de Ubuntu
FROM mysql:5.7.15

# Autor
MAINTAINER Muñoz Thomas

ENV MYSQL_DATABASE=competencias \
	MYSQL_ROOT_PASSWORD=oriana99 


ADD dumpBs.sql/ docker-entrypoint-initdb.d

EXPOSE 3306 