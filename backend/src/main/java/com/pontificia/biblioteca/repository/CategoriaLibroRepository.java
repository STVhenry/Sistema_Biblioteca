package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.CategoriaLibro;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de CategoriaLibro. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface CategoriaLibroRepository extends JpaRepository<CategoriaLibro, Long> {
}
