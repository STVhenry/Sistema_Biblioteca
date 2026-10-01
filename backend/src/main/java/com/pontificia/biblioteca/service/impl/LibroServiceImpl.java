package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.Libro;
import com.pontificia.biblioteca.repository.LibroRepository;
import com.pontificia.biblioteca.service.LibroService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LibroServiceImpl implements LibroService {

    private final LibroRepository repository;

    public LibroServiceImpl(LibroRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Libro> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Libro buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Libro guardar(Libro entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
