package com.pontificia.biblioteca.repository;

import com.pontificia.biblioteca.entity.Socio;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Socio. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface SocioRepository extends JpaRepository<Socio, Long> {
}
