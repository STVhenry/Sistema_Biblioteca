package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.DetallePrestamo;

import java.util.List;

public interface DetallePrestamoService {
    List<DetallePrestamo> listarTodos();
    DetallePrestamo buscarPorId(Long id);
    DetallePrestamo guardar(DetallePrestamo entidad);
    void eliminar(Long id);
}
