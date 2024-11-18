create database nextLevel;
use nextLevel;

create table login(
id_login int auto_increment primary key,
correo varchar (40),
contraseña varchar(40)
);


create table categoria(
id_categoria int primary key,
nombre varchar (30));

-- inserciones de categoria

insert into categoria(id_categoria, nombre)
values( 1234, 'computadores'),
(4567, 'accesorios'),
(7890, 'sillas Gamer');

create table productos(
id int auto_increment primary key,
nombre varchar (60),
precio int,
descripcion varchar (100),
unidades int,
categoria int, 
foreign key (categoria) references Categoria (id_categoria));

drop table productos;
select * from productos;
show tables;

-- inserciones productos

insert into productos (nombre, precio, descripcion,unidades, categoria)
values('Silla Gamer pro SGJR 006 RGB PLUS con parlantes', 1500000, 'Silla gamer con diseño ergonomico. Material: marco de metal, cuero artificial', 320, 7890),
('Silla Gamer RGB PRO SGJR-005 PLUS', 1400000, 'Silla gamer con diseño ergonomico. Material: marco de metal, cuero artificial', 244, 7890),
('Diadema Gamer G833', 699000, 'Lila inalambrica Logitech', 300, 4567),
('Diadema Gamer G833', 699000, 'Blanca inalambrica Logitech', 205, 4567),
('Diadema Gamer 6435',525000, 'Negro-Amarillo Logitech, Inalambrica & Bluetooth', 360, 4567),
('Teclado Mecanico 6715 TKL', 1055000, 'Aurora RGB Blanco Logitech(inalambrica & Bluetooth)', 200, 4567),
('Teclado Gamer G213 Prodigy usb',343000, 'Logitech, negro, RGB (Membrana Mech-Dome)', 150, 4567),
('Pad Mouse Desk ', 129000, 'Mat studio Lavanda Logitech (30 x 70cm)', 235, 4567),
('Ideapad Lenovo 15.6',  3899000, 'Computador portatil LENOVO ideapad 15.6 slim 3 tactil - intel core ¡5 RAM 16gb- disco SSD 512GB gris', 300, 1234),
('Vivobook 16 pulgadas ASUS', 4299000, 'Computador portatil ASUS Vivobook 16" X1605ZA-intel core¡5 RAM 16GB DISCO SSD 1 TB-NEGRO', 450, 1234),
('HP Pavilion 14"', 2949000, 'Computador portatil, 2 en 1 Hp pavilion 14" Ek 008la Interl core¡5 - Ram 8gb - disco SSD 512GB NEGRO', 153, 1234);
