package com.imperium.arhelp.refugee_help.controller;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import com.imperium.arhelp.refugee_help.model.LoginRequestDTO;
import com.imperium.arhelp.refugee_help.repository.OrganizacaoRepository;
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
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO credentials) {
        // 1. Busca a organização usando o 'service' que já está injetado lá em cima
        Optional<Organizacao> orgOptional = service.buscarPorEmail(credentials.getEmail());

        if (orgOptional.isPresent()) {
            Organizacao org = orgOptional.get();

            // 2. Compara a senha do banco com a senha enviada pelo Front-end
            if (org.getSenha() != null && org.getSenha().equals(credentials.getPassword())) {
                return ResponseEntity.ok(org); // Retorna HTTP 200 OK e os dados da ONG
            }
        }

        // 3. Se o e-mail não existir ou a senha estiver errada, retorna erro
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos.");
    }
}