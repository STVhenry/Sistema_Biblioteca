package com.pontificia.biblioteca.service;

import com.pontificia.biblioteca.entity.Prestamo;

import java.util.List;

public interface PrestamoService {
    List<Prestamo> listarTodos();
    Prestamo buscarPorId(Long id);
    Prestamo guardar(Prestamo entidad);
    void eliminar(Long id);

    /**
     * Regla de negocio: devuelve todos los prestamos activos cuya
     * fecha limite ya paso (estan vencidos), para mostrar alertas.
     */
    List<Prestamo> listarVencidos();

    /**
     * Regla de negocio: marca un prestamo como DEVUELTO. Si la fecha
     * de devolucion es posterior a la fecha limite, genera
     * automaticamente una Multa por cada dia de atraso (S/ 1.00 por dia).
     */
    Prestamo registrarDevolucion(Long idPrestamo);
}
