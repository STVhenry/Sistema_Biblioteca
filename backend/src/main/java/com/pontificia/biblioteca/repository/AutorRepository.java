package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.Autor;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Autor. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface AutorRepository extends JpaRepository<Autor, Long> {
}
