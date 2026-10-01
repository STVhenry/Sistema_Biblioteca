package com.pontificia.biblioteca.controller.api;

import com.pontificia.biblioteca.entity.LibroAutor;
import com.pontificia.biblioteca.service.LibroAutorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST: expone LibroAutor en formato JSON.
 * No usa formularios ni vistas; todo el registro se hace via
 * peticiones HTTP (fetch/axios/HttpClient) con cuerpo JSON.
 */
@RestController
@RequestMapping("/api/libro-autores")
public class LibroAutorApiController {

    private final LibroAutorService libroAutorService;

    public LibroAutorApiController(LibroAutorService libroAutorService) {
        this.libroAutorService = libroAutorService;
    }

    @GetMapping
    public ResponseEntity<List<LibroAutor>> listar() {
        return ResponseEntity.ok(libroAutorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        LibroAutor entidad = libroAutorService.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "LibroAutor no encontrado con ID: " + id));
        }
        return ResponseEntity.ok(entidad);
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody LibroAutor entidad) {
        try {
            LibroAutor guardado = libroAutorService.guardar(entidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody LibroAutor datos) {
        LibroAutor existente = libroAutorService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "LibroAutor no encontrado con ID: " + id));
        }
        datos.setId(id);
        return ResponseEntity.ok(libroAutorService.guardar(datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            libroAutorService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "LibroAutor eliminado correctamente"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo eliminar: " + ex.getMessage()));
        }
    }
}
