package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.Ejemplar;
import com.pontificia.biblioteca.repository.EjemplarRepository;
import com.pontificia.biblioteca.service.EjemplarService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EjemplarServiceImpl implements EjemplarService {

    private final EjemplarRepository repository;

    public EjemplarServiceImpl(EjemplarRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ejemplar> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Ejemplar buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Ejemplar guardar(Ejemplar entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
