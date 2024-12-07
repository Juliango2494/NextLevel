CREATE DATABASE apiLogAdm;
USE apiLogAdm;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL
);

insert into usuarios(username,password, role)
value('administrador', '12345678' , 'admin');


insert into usuarios(username,password)
value('usuario1', '87654321' );

select * from usuarios;
