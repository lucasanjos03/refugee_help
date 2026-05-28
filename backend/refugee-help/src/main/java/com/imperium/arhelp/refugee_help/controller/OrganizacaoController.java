package com.imperium.arhelp.refugee_help.controller;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import com.imperium.arhelp.refugee_help.model.LoginRequestDTO;
import com.imperium.arhelp.refugee_help.service.OrganizacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizacoes")
@CrossOrigin(origins = "*")
public class OrganizacaoController {

    @Autowired
    private OrganizacaoService service;

    @PostMapping
    public ResponseEntity<Organizacao> criar(@Valid @RequestBody Organizacao org) {
        Organizacao salva = service.salvar(org);
        return new ResponseEntity<>(salva, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Organizacao>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/busca")
    public ResponseEntity<List<Organizacao>> buscarPorTipo(@RequestParam String tipo) {
        return ResponseEntity.ok(service.buscarPorTipo(tipo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO credentials) {
        Optional<Organizacao> orgOptional = service.buscarPorEmail(credentials.getEmail());

        if (orgOptional.isPresent()) {
            Organizacao org = orgOptional.get();
            if (org.getSenha() != null && org.getSenha().equals(credentials.getPassword())) {
                return ResponseEntity.ok(org);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos.");
    }
}