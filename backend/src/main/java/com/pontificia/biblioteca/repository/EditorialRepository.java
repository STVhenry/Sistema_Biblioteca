package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.Editorial;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Editorial. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface EditorialRepository extends JpaRepository<Editorial, Long> {
}
