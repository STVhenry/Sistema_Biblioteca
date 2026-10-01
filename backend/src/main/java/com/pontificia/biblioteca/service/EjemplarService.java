package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.Ejemplar;

import java.util.List;

public interface EjemplarService {
    List<Ejemplar> listarTodos();
    Ejemplar buscarPorId(Long id);
    Ejemplar guardar(Ejemplar entidad);
    void eliminar(Long id);
}
