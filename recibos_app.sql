



create schema recibos_app;

use recibos_app;

create table rol(
	id integer auto_increment,
    nombre varchar(20),
    primary key(id)
);

create table tipo_documento (
	id integer auto_increment,
    nombre varchar(20),
    primary key(id)
);

create table tipo_recibo(
	id integer auto_increment,
    nombre varchar(20),
    primary key(id)
);

create table persona(
	id integer auto_increment primary key,
    tipoDoc integer,
    n_doc varchar(20),
    nombre varchar(20),
    apellido varchar(20),
    fecha_nacimiento date,
    CONSTRAINT FK1_PERSONA FOREIGN KEY(tipoDoc) REFERENCES tipo_documento(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);



create table usuario(
	id integer auto_increment primary key,
    idPersona integer,
    idRol integer,
    nick unique varchar(20),
    email varchar(20),
    password text,
    avatar varchar(50),
    CONSTRAINT FK1_USUARIO FOREIGN KEY(idPersona) REFERENCES persona(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK2_USUARIO FOREIGN KEY(idRol) REFERENCES rol(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);


create table recibo(
	id integer auto_increment primary key,
	idUsuarioContador integer,
    idUsuarioEmpleado integer,
    idTipoRecibo integer,
    fecha datetime,
    sueldo_neto float,
    sueldo_bruto float,
    visto boolean,
    CONSTRAINT FK1_RECIBO FOREIGN KEY(idUsuarioContador) REFERENCES usuario(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT FK2_RECIBO FOREIGN KEY(idUsuarioEmpleado) REFERENCES usuario(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT FK3_RECIBO FOREIGN KEY(idTipoRecibo) REFERENCES tipo_recibo(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);
