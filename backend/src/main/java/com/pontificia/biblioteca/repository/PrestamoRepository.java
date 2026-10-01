package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Prestamo. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {
}
