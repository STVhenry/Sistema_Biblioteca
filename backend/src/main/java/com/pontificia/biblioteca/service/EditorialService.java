package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.Editorial;

import java.util.List;

public interface EditorialService {
    List<Editorial> listarTodos();
    Editorial buscarPorId(Long id);
    Editorial guardar(Editorial entidad);
    void eliminar(Long id);
}
