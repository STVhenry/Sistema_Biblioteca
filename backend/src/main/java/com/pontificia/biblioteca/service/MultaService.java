package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.Multa;

import java.util.List;

public interface MultaService {
    List<Multa> listarTodos();
    Multa buscarPorId(Long id);
    Multa guardar(Multa entidad);
    void eliminar(Long id);
}
