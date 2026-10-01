package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.Autor;

import java.util.List;

public interface AutorService {
    List<Autor> listarTodos();
    Autor buscarPorId(Long id);
    Autor guardar(Autor entidad);
    void eliminar(Long id);
}
