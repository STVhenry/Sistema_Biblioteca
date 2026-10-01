package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.DetallePrestamo;
import com.pontificia.biblioteca.repository.DetallePrestamoRepository;
import com.pontificia.biblioteca.service.DetallePrestamoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DetallePrestamoServiceImpl implements DetallePrestamoService {

    private final DetallePrestamoRepository repository;

    public DetallePrestamoServiceImpl(DetallePrestamoRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetallePrestamo> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public DetallePrestamo buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public DetallePrestamo guardar(DetallePrestamo entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
