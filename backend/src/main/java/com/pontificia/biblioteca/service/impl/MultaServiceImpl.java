package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.Multa;
import com.pontificia.biblioteca.repository.MultaRepository;
import com.pontificia.biblioteca.service.MultaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MultaServiceImpl implements MultaService {

    private final MultaRepository repository;

    public MultaServiceImpl(MultaRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Multa> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Multa buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Multa guardar(Multa entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
