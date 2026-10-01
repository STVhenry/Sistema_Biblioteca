package com.pontificia.biblioteca.controller.api;

import com.pontificia.biblioteca.entity.Libro;
import com.pontificia.biblioteca.service.LibroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST: expone Libro en formato JSON.
 * No usa formularios ni vistas; todo el registro se hace via
 * peticiones HTTP (fetch/axios/HttpClient) con cuerpo JSON.
 */
@RestController
@RequestMapping("/api/libros")
public class LibroApiController {

    private final LibroService libroService;

    public LibroApiController(LibroService libroService) {
        this.libroService = libroService;
    }

    @GetMapping
    public ResponseEntity<List<Libro>> listar() {
        return ResponseEntity.ok(libroService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Libro entidad = libroService.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Libro no encontrado con ID: " + id));
        }
        return ResponseEntity.ok(entidad);
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Libro entidad) {
        try {
            Libro guardado = libroService.guardar(entidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Libro datos) {
        Libro existente = libroService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Libro no encontrado con ID: " + id));
        }
        datos.setId(id);
        return ResponseEntity.ok(libroService.guardar(datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            libroService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Libro eliminado correctamente"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo eliminar: " + ex.getMessage()));
        }
    }
}
