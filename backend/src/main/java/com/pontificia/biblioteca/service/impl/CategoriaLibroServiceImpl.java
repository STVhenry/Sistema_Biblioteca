package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.CategoriaLibro;
import com.pontificia.biblioteca.repository.CategoriaLibroRepository;
import com.pontificia.biblioteca.service.CategoriaLibroService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoriaLibroServiceImpl implements CategoriaLibroService {

    private final CategoriaLibroRepository repository;

    public CategoriaLibroServiceImpl(CategoriaLibroRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaLibro> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaLibro buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public CategoriaLibro guardar(CategoriaLibro entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
