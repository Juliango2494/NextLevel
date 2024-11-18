create database nextLevel;
use nextLevel;

create table login(
id int auto_increment primary key,
correo varchar (40),
contraseña varchar(40)
);

create table productos(
id int auto_increment primary key,
nombre varchar (30),
precio int,
descripcion varchar (60),
unidades int);