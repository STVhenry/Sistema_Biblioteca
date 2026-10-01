package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.Usuario;

import java.util.List;

public interface UsuarioService {
    List<Usuario> listarTodos();
    Usuario buscarPorId(Long id);
    Usuario guardar(Usuario entidad);
    void eliminar(Long id);
}
