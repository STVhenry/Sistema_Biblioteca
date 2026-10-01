package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.DetallePrestamo;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de DetallePrestamo. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface DetallePrestamoRepository extends JpaRepository<DetallePrestamo, Long> {
}
