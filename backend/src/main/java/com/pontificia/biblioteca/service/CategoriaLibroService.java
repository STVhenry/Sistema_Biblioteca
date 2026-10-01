package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.CategoriaLibro;

import java.util.List;

public interface CategoriaLibroService {
    List<CategoriaLibro> listarTodos();
    CategoriaLibro buscarPorId(Long id);
    CategoriaLibro guardar(CategoriaLibro entidad);
    void eliminar(Long id);
}
