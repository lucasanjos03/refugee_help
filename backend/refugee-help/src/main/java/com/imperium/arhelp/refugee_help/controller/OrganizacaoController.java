package com.imperium.arhelp.refugee_help.controller;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import com.imperium.arhelp.refugee_help.service.OrganizacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizacoes")
@CrossOrigin(origins = "*") // Permite que o seu futuro Frontend React acesse a API sem erros de CORS
public class OrganizacaoController {

    @Autowired
    private OrganizacaoService service;

    // Endpoint para Cadastrar (POST)
    @PostMapping
    public ResponseEntity<Organizacao> criar(@Valid @RequestBody Organizacao org) {
        Organizacao salva = service.salvar(org);
        return new ResponseEntity<>(salva, HttpStatus.CREATED);
    }

    // Endpoint para Listar Todas (GET)
    @GetMapping
    public ResponseEntity<List<Organizacao>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    // Endpoint para Busca Dinâmica por Tipo (GET com Query Parameter)
    // Exemplo no Postman: http://localhost:8080/api/organizacoes/busca?tipo=ONG
    @GetMapping("/busca")
    public ResponseEntity<List<Organizacao>> buscarPorTipo(@RequestParam String tipo) {
        return ResponseEntity.ok(service.buscarPorTipo(tipo));
    }

    // Endpoint para Deletar (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}