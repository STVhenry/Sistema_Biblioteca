package com.pontificia.biblioteca.controller.api;

import com.pontificia.biblioteca.entity.Prestamo;
import com.pontificia.biblioteca.service.PrestamoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST: expone Prestamo en formato JSON.
 * No usa formularios ni vistas; todo el registro se hace via
 * peticiones HTTP (fetch/axios/HttpClient) con cuerpo JSON.
 */
@RestController
@RequestMapping("/api/prestamos")
public class PrestamoApiController {

    private final PrestamoService prestamoService;

    public PrestamoApiController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @GetMapping
    public ResponseEntity<List<Prestamo>> listar() {
        return ResponseEntity.ok(prestamoService.listarTodos());
    }

    @GetMapping("/vencidos")
    public ResponseEntity<List<Prestamo>> listarVencidos() {
        return ResponseEntity.ok(prestamoService.listarVencidos());
    }

    @PatchMapping("/{id}/devolucion")
    public ResponseEntity<?> registrarDevolucion(@PathVariable Long id) {
        try {
            Prestamo actualizado = prestamoService.registrarDevolucion(id);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Prestamo entidad = prestamoService.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Prestamo no encontrado con ID: " + id));
        }
        return ResponseEntity.ok(entidad);
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Prestamo entidad) {
        try {
            Prestamo guardado = prestamoService.guardar(entidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Prestamo datos) {
        Prestamo existente = prestamoService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Prestamo no encontrado con ID: " + id));
        }
        datos.setId(id);
        return ResponseEntity.ok(prestamoService.guardar(datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            prestamoService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Prestamo eliminado correctamente"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo eliminar: " + ex.getMessage()));
        }
    }
}
