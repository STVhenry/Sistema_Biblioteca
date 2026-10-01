package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.LibroAutor;

import java.util.List;

public interface LibroAutorService {
    List<LibroAutor> listarTodos();
    LibroAutor buscarPorId(Long id);
    LibroAutor guardar(LibroAutor entidad);
    void eliminar(Long id);
}
