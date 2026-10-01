package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.Socio;
import com.pontificia.biblioteca.repository.SocioRepository;
import com.pontificia.biblioteca.service.SocioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SocioServiceImpl implements SocioService {

    private final SocioRepository repository;

    public SocioServiceImpl(SocioRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Socio> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Socio buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Socio guardar(Socio entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
