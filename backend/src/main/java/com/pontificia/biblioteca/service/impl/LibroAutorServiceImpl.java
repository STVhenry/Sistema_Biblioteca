package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.LibroAutor;
import com.pontificia.biblioteca.repository.LibroAutorRepository;
import com.pontificia.biblioteca.service.LibroAutorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LibroAutorServiceImpl implements LibroAutorService {

    private final LibroAutorRepository repository;

    public LibroAutorServiceImpl(LibroAutorRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LibroAutor> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public LibroAutor buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public LibroAutor guardar(LibroAutor entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
