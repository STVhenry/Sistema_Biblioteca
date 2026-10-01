package com.pontificia.biblioteca.controller.api;

import com.pontificia.biblioteca.dto.LoginRequest;
import com.pontificia.biblioteca.dto.LoginResponse;
import com.pontificia.biblioteca.entity.Usuario;
import com.pontificia.biblioteca.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Controlador de autenticacion. Login simple contra la tabla "usuario"
 * (username + password en texto plano, alcance academico).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final UsuarioRepository usuarioRepository;

    public AuthApiController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Usuario y contraseña son obligatorios"));
        }

        Optional<Usuario> encontrado = usuarioRepository.findByUsername(request.getUsername());

        if (encontrado.isEmpty() || !encontrado.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Usuario o contraseña incorrectos"));
        }

        Usuario usuario = encontrado.get();

        if (Boolean.FALSE.equals(usuario.getActivo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("mensaje", "El usuario está inactivo"));
        }

        LoginResponse response = new LoginResponse(
                usuario.getId(),
                usuario.getNombreCompleto(),
                usuario.getUsername(),
                usuario.getRol() != null ? usuario.getRol().getNombre() : null
        );

        return ResponseEntity.ok(response);
    }
}
