-- =====================================================================
-- SISTEMA DE GESTION DE BIBLIOTECA - Script de Base de Datos (MySQL)
-- Proyecto academico: Programacion de Aplicaciones Web
-- Motor: MySQL 8.x  |  Charset: utf8mb4
-- =====================================================================

CREATE DATABASE IF NOT EXISTS biblioteca_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE biblioteca_db;

-- ---------------------------------------------------------------------
-- 1. TABLA: rol  (catalogo de roles del sistema)
-- ---------------------------------------------------------------------
CREATE TABLE rol (
    id_rol      BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. TABLA: usuario  (bibliotecarios / administradores del sistema)
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario       BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo  VARCHAR(150) NOT NULL,
    username         VARCHAR(50)  NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    email            VARCHAR(100),
    id_rol           BIGINT NOT NULL,
    activo           TINYINT(1) DEFAULT 1,
    fecha_registro   DATE DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. TABLA: categoria_libro  (genero / categoria bibliografica)
-- ---------------------------------------------------------------------
CREATE TABLE categoria_libro (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL UNIQUE,
    descripcion  VARCHAR(255)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. TABLA: editorial
-- ---------------------------------------------------------------------
CREATE TABLE editorial (
    id_editorial BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    pais         VARCHAR(80),
    telefono     VARCHAR(20)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. TABLA: autor
-- ---------------------------------------------------------------------
CREATE TABLE autor (
    id_autor     BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres      VARCHAR(100) NOT NULL,
    apellidos    VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(80)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. TABLA: socio  (lector / miembro registrado de la biblioteca)
-- ---------------------------------------------------------------------
CREATE TABLE socio (
    id_socio          BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_documento  VARCHAR(15)  NOT NULL UNIQUE,
    nombres           VARCHAR(150) NOT NULL,
    telefono          VARCHAR(20),
    email             VARCHAR(100),
    direccion         VARCHAR(200),
    fecha_inscripcion DATE DEFAULT (CURRENT_DATE),
    estado            TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. TABLA: libro  (titulo bibliografico)
-- ---------------------------------------------------------------------
CREATE TABLE libro (
    id_libro       BIGINT AUTO_INCREMENT PRIMARY KEY,
    isbn           VARCHAR(20)  NOT NULL UNIQUE,
    titulo         VARCHAR(200) NOT NULL,
    anio_publicacion INT,
    id_categoria   BIGINT NOT NULL,
    id_editorial   BIGINT NOT NULL,
    numero_paginas INT,
    estado         TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_libro_categoria FOREIGN KEY (id_categoria) REFERENCES categoria_libro(id_categoria),
    CONSTRAINT fk_libro_editorial FOREIGN KEY (id_editorial) REFERENCES editorial(id_editorial)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. TABLA: libro_autor  (relacion N:M entre libro y autor)
-- ---------------------------------------------------------------------
CREATE TABLE libro_autor (
    id_libro_autor BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_libro       BIGINT NOT NULL,
    id_autor       BIGINT NOT NULL,
    CONSTRAINT fk_libroautor_libro FOREIGN KEY (id_libro) REFERENCES libro(id_libro) ON DELETE CASCADE,
    CONSTRAINT fk_libroautor_autor FOREIGN KEY (id_autor) REFERENCES autor(id_autor),
    CONSTRAINT uq_libro_autor UNIQUE (id_libro, id_autor)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. TABLA: ejemplar  (copia fisica de un libro, es lo que se presta)
-- ---------------------------------------------------------------------
CREATE TABLE ejemplar (
    id_ejemplar    BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_libro       BIGINT NOT NULL,
    codigo_barra   VARCHAR(30) NOT NULL UNIQUE,
    ubicacion      VARCHAR(100),
    estado         VARCHAR(20) DEFAULT 'DISPONIBLE',  -- DISPONIBLE, PRESTADO, DE_BAJA
    CONSTRAINT fk_ejemplar_libro FOREIGN KEY (id_libro) REFERENCES libro(id_libro) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. TABLA: prestamo  (cabecera de un prestamo a un socio)
-- ---------------------------------------------------------------------
CREATE TABLE prestamo (
    id_prestamo     BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_socio        BIGINT NOT NULL,
    id_usuario      BIGINT NOT NULL,
    fecha_prestamo  DATE NOT NULL,
    fecha_limite    DATE NOT NULL,
    estado          VARCHAR(20) DEFAULT 'ACTIVO',  -- ACTIVO, DEVUELTO, VENCIDO
    CONSTRAINT fk_prestamo_socio FOREIGN KEY (id_socio) REFERENCES socio(id_socio),
    CONSTRAINT fk_prestamo_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. TABLA: detalle_prestamo  (relacion N:M entre prestamo y ejemplar)
-- ---------------------------------------------------------------------
CREATE TABLE detalle_prestamo (
    id_detalle_prestamo BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_prestamo         BIGINT NOT NULL,
    id_ejemplar         BIGINT NOT NULL,
    fecha_devolucion    DATE,
    estado              VARCHAR(20) DEFAULT 'PENDIENTE',  -- PENDIENTE, DEVUELTO
    CONSTRAINT fk_detprestamo_prestamo FOREIGN KEY (id_prestamo) REFERENCES prestamo(id_prestamo) ON DELETE CASCADE,
    CONSTRAINT fk_detprestamo_ejemplar FOREIGN KEY (id_ejemplar) REFERENCES ejemplar(id_ejemplar)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 12. TABLA: multa  (penalidad por devolucion tardia de un prestamo)
-- ---------------------------------------------------------------------
CREATE TABLE multa (
    id_multa    BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_prestamo BIGINT NOT NULL,
    id_socio    BIGINT NOT NULL,
    monto       DECIMAL(10,2) NOT NULL,
    motivo      VARCHAR(200),
    fecha_multa DATE DEFAULT (CURRENT_DATE),
    pagada      TINYINT(1) DEFAULT 0,
    CONSTRAINT fk_multa_prestamo FOREIGN KEY (id_prestamo) REFERENCES prestamo(id_prestamo),
    CONSTRAINT fk_multa_socio FOREIGN KEY (id_socio) REFERENCES socio(id_socio)
) ENGINE=InnoDB;

-- =====================================================================
-- DATOS INICIALES (seed) para poder probar el sistema de inmediato
-- =====================================================================
INSERT INTO rol (nombre, descripcion) VALUES
 ('ADMIN', 'Administrador del sistema'),
 ('BIBLIOTECARIO', 'Encargado de prestamos y devoluciones');

INSERT INTO usuario (nombre_completo, username, password, email, id_rol) VALUES
 ('Administrador General', 'admin', 'admin123', 'admin@biblioteca.com', 1);

INSERT INTO categoria_libro (nombre, descripcion) VALUES
 ('Novela', 'Obras de ficcion narrativa'),
 ('Ciencia', 'Libros de divulgacion cientifica'),
 ('Tecnologia', 'Libros de programacion e informatica');

INSERT INTO editorial (nombre, pais, telefono) VALUES
 ('Editorial Planeta', 'España', '911223344'),
 ('O''Reilly Media', 'Estados Unidos', '14155551234');

INSERT INTO autor (nombres, apellidos, nacionalidad) VALUES
 ('Gabriel', 'Garcia Marquez', 'Colombiana'),
 ('Robert C.', 'Martin', 'Estadounidense');

INSERT INTO socio (numero_documento, nombres, telefono, email, direccion) VALUES
 ('45678912', 'Ana Torres Huaman', '987654321', 'ana.torres@gmail.com', 'Jr. Sucre 456, Ayacucho');

INSERT INTO libro (isbn, titulo, anio_publicacion, id_categoria, id_editorial, numero_paginas) VALUES
 ('978-0307474728', 'Cien años de soledad', 1967, 1, 1, 496),
 ('978-0132350884', 'Clean Code', 2008, 3, 2, 464);

INSERT INTO libro_autor (id_libro, id_autor) VALUES (1, 1), (2, 2);

INSERT INTO ejemplar (id_libro, codigo_barra, ubicacion) VALUES
 (1, 'EJ-0001', 'Estante A-1'),
 (2, 'EJ-0002', 'Estante C-3');
