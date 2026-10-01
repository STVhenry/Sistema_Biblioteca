package com.pontificia.biblioteca.controller.api;

import com.pontificia.biblioteca.entity.Editorial;
import com.pontificia.biblioteca.service.EditorialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST: expone Editorial en formato JSON.
 * No usa formularios ni vistas; todo el registro se hace via
 * peticiones HTTP (fetch/axios/HttpClient) con cuerpo JSON.
 */
@RestController
@RequestMapping("/api/editoriales")
public class EditorialApiController {

    private final EditorialService editorialService;

    public EditorialApiController(EditorialService editorialService) {
        this.editorialService = editorialService;
    }

    @GetMapping
    public ResponseEntity<List<Editorial>> listar() {
        return ResponseEntity.ok(editorialService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Editorial entidad = editorialService.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Editorial no encontrado con ID: " + id));
        }
        return ResponseEntity.ok(entidad);
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Editorial entidad) {
        try {
            Editorial guardado = editorialService.guardar(entidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Editorial datos) {
        Editorial existente = editorialService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Editorial no encontrado con ID: " + id));
        }
        datos.setId(id);
        return ResponseEntity.ok(editorialService.guardar(datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            editorialService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Editorial eliminado correctamente"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo eliminar: " + ex.getMessage()));
        }
    }
}
