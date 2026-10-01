package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.Libro;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Libro. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface LibroRepository extends JpaRepository<Libro, Long> {
}
