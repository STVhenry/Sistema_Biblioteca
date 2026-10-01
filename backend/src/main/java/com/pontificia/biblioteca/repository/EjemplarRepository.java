package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.Ejemplar;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Ejemplar. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface EjemplarRepository extends JpaRepository<Ejemplar, Long> {
}
