package com.imperium.arhelp.refugee_help.controller;

import com.imperium.arhelp.refugee_help.model.Refugiado;
import com.imperium.arhelp.refugee_help.service.RefugiadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/refugiados")
@CrossOrigin(origins = "*")
public class RefugiadoController {

    @Autowired
    private RefugiadoService service;

    // Endpoint para Cadastrar Refugiado (POST)
    @PostMapping
    public ResponseEntity<Refugiado> criar(@Valid @RequestBody Refugiado refugiado) {
        Refugiado salvo = service.salvar(refugiado);
        return new ResponseEntity<>(salvo, HttpStatus.CREATED);
    }

    // Endpoint para Listar Todos (GET)
    @GetMapping
    public ResponseEntity<List<Refugiado>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // Endpoint para Buscar Específico por ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Refugiado> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // Endpoint para Atualizar Dados (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Refugiado> atualizar(@PathVariable Long id, @Valid @RequestBody Refugiado dadosNovos) {
        Refugiado atualizado = service.atualizar(id, dadosNovos);
        return ResponseEntity.ok(atualizado);
    }
}