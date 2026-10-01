package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.Libro;

import java.util.List;

public interface LibroService {
    List<Libro> listarTodos();
    Libro buscarPorId(Long id);
    Libro guardar(Libro entidad);
    void eliminar(Long id);
}
