package com.pontificia.biblioteca.controller.api;

import com.pontificia.biblioteca.entity.Ejemplar;
import com.pontificia.biblioteca.service.EjemplarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST: expone Ejemplar en formato JSON.
 * No usa formularios ni vistas; todo el registro se hace via
 * peticiones HTTP (fetch/axios/HttpClient) con cuerpo JSON.
 */
@RestController
@RequestMapping("/api/ejemplares")
public class EjemplarApiController {

    private final EjemplarService ejemplarService;

    public EjemplarApiController(EjemplarService ejemplarService) {
        this.ejemplarService = ejemplarService;
    }

    @GetMapping
    public ResponseEntity<List<Ejemplar>> listar() {
        return ResponseEntity.ok(ejemplarService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Ejemplar entidad = ejemplarService.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Ejemplar no encontrado con ID: " + id));
        }
        return ResponseEntity.ok(entidad);
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Ejemplar entidad) {
        try {
            Ejemplar guardado = ejemplarService.guardar(entidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Ejemplar datos) {
        Ejemplar existente = ejemplarService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Ejemplar no encontrado con ID: " + id));
        }
        datos.setId(id);
        return ResponseEntity.ok(ejemplarService.guardar(datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            ejemplarService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Ejemplar eliminado correctamente"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo eliminar: " + ex.getMessage()));
        }
    }
}
