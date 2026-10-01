package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.LibroAutor;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de LibroAutor. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface LibroAutorRepository extends JpaRepository<LibroAutor, Long> {
}
