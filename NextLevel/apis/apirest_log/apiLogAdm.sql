CREATE DATABASE apiLogAdm;
USE apiLogAdm;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  direction VARCHAR (255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL
);
