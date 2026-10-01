package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.Autor;
import com.pontificia.biblioteca.repository.AutorRepository;
import com.pontificia.biblioteca.service.AutorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AutorServiceImpl implements AutorService {

    private final AutorRepository repository;

    public AutorServiceImpl(AutorRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Autor> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Autor buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Autor guardar(Autor entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
