package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.Multa;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Multa. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface MultaRepository extends JpaRepository<Multa, Long> {
}
