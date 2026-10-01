package com.pontificia.biblioteca.service.impl;

import com.pontificia.biblioteca.entity.Multa;
import com.pontificia.biblioteca.entity.Prestamo;
import com.pontificia.biblioteca.repository.MultaRepository;
import com.pontificia.biblioteca.repository.PrestamoRepository;
import com.pontificia.biblioteca.service.PrestamoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class PrestamoServiceImpl implements PrestamoService {

    private static final BigDecimal MONTO_MULTA_POR_DIA = new BigDecimal("1.00");

    private final PrestamoRepository repository;
    private final MultaRepository multaRepository;

    public PrestamoServiceImpl(PrestamoRepository repository, MultaRepository multaRepository) {
        this.repository = repository;
        this.multaRepository = multaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prestamo> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Prestamo buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Prestamo guardar(Prestamo entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prestamo> listarVencidos() {
        LocalDate hoy = LocalDate.now();
        return repository.findAll().stream()
                .filter(p -> "ACTIVO".equals(p.getEstado())
                        && p.getFechaLimite() != null
                        && p.getFechaLimite().isBefore(hoy))
                .toList();
    }

    @Override
    public Prestamo registrarDevolucion(Long idPrestamo) {
        Prestamo prestamo = repository.findById(idPrestamo)
                .orElseThrow(() -> new IllegalArgumentException("Prestamo no encontrado con ID: " + idPrestamo));

        LocalDate hoy = LocalDate.now();
        prestamo.setEstado("DEVUELTO");
        repository.save(prestamo);

        if (prestamo.getFechaLimite() != null && hoy.isAfter(prestamo.getFechaLimite())) {
            long diasAtraso = ChronoUnit.DAYS.between(prestamo.getFechaLimite(), hoy);
            Multa multa = new Multa();
            multa.setPrestamo(prestamo);
            multa.setSocio(prestamo.getSocio());
            multa.setMonto(MONTO_MULTA_POR_DIA.multiply(BigDecimal.valueOf(diasAtraso)));
            multa.setMotivo("Devolucion con " + diasAtraso + " dia(s) de atraso");
            multa.setFechaMulta(hoy);
            multa.setPagada(false);
            multaRepository.save(multa);
        }

        return prestamo;
    }
}
