package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.Editorial;
import com.pontificia.biblioteca.repository.EditorialRepository;
import com.pontificia.biblioteca.service.EditorialService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EditorialServiceImpl implements EditorialService {

    private final EditorialRepository repository;

    public EditorialServiceImpl(EditorialRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Editorial> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Editorial buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Editorial guardar(Editorial entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
