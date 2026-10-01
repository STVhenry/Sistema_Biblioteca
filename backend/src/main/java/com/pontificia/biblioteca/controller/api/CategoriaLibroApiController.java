package com.pontificia.biblioteca.controller.api;

import com.pontificia.biblioteca.entity.CategoriaLibro;
import com.pontificia.biblioteca.service.CategoriaLibroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST: expone CategoriaLibro en formato JSON.
 * No usa formularios ni vistas; todo el registro se hace via
 * peticiones HTTP (fetch/axios/HttpClient) con cuerpo JSON.
 */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaLibroApiController {

    private final CategoriaLibroService categoriaLibroService;

    public CategoriaLibroApiController(CategoriaLibroService categoriaLibroService) {
        this.categoriaLibroService = categoriaLibroService;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaLibro>> listar() {
        return ResponseEntity.ok(categoriaLibroService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        CategoriaLibro entidad = categoriaLibroService.buscarPorId(id);
        if (entidad == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "CategoriaLibro no encontrado con ID: " + id));
        }
        return ResponseEntity.ok(entidad);
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody CategoriaLibro entidad) {
        try {
            CategoriaLibro guardado = categoriaLibroService.guardar(entidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaLibro datos) {
        CategoriaLibro existente = categoriaLibroService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "CategoriaLibro no encontrado con ID: " + id));
        }
        datos.setId(id);
        return ResponseEntity.ok(categoriaLibroService.guardar(datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            categoriaLibroService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "CategoriaLibro eliminado correctamente"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo eliminar: " + ex.getMessage()));
        }
    }
}
