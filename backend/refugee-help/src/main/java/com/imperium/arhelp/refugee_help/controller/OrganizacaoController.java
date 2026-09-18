package com.imperium.arhelp.refugee_help.controller;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import com.imperium.arhelp.refugee_help.model.LoginRequestDTO;
import com.imperium.arhelp.refugee_help.dto.OrganizacaoResponseDTO;
import com.imperium.arhelp.refugee_help.service.OrganizacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizacoes")
public class OrganizacaoController {

    @Autowired
    private OrganizacaoService service;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<OrganizacaoResponseDTO> criar(@Valid @RequestBody Organizacao org) {
        OrganizacaoResponseDTO salva = service.salvar(org);
        return new ResponseEntity<>(salva, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrganizacaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/busca")
    public ResponseEntity<List<OrganizacaoResponseDTO>> buscarPorTipo(@RequestParam String tipo) {
        return ResponseEntity.ok(service.buscarPorTipo(tipo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO credentials) {
        Optional<Organizacao> orgOptional = service.buscarPorEmail(credentials.getEmail());

        if (orgOptional.isPresent()) {
            Organizacao org = orgOptional.get();
            if (org.getSenha() != null && passwordEncoder.matches(credentials.getPassword(), org.getSenha())) {
                return ResponseEntity.ok(service.toResponseDTO(org));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos.");
    }
}
