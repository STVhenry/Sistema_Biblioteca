package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.Socio;

import java.util.List;

public interface SocioService {
    List<Socio> listarTodos();
    Socio buscarPorId(Long id);
    Socio guardar(Socio entidad);
    void eliminar(Long id);
}
