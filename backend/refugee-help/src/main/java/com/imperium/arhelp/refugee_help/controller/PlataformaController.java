package com.imperium.arhelp.refugee_help.controller;

import com.imperium.arhelp.refugee_help.repository.OrganizacaoRepository;
import com.imperium.arhelp.refugee_help.repository.RefugiadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/plataforma")
@CrossOrigin(origins = "*")
public class PlataformaController {

    @Autowired
    private RefugiadoRepository refugiadoRepository;

    @Autowired
    private OrganizacaoRepository organizacaoRepository;

    // Rota para os cards do Hero (Página Inicial / Landing Page)
    @GetMapping("/estatisticas")
    public ResponseEntity<Map<String, Object>> getEstatisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("taxaSatisfacao", "98%");
        stats.put("tempoResposta", "Abaixo de 24h");
        stats.put("custo", "100% Gratuito");
        stats.put("idiomasSuportados", 3);

        return ResponseEntity.ok(stats);
    }

    // Rota exclusiva para o Painel do Administrador (Dashboard funcional exigido pelo professor)
    @GetMapping("/admin/dashboard")
    public ResponseEntity<Map<String, Object>> getPainelAdmin() {
        Map<String, Object> painel = new HashMap<>();

        // O Java vai ao banco e conta de forma dinâmica quantos registros existem em cada tabela
        painel.put("totalRefugiados", refugiadoRepository.count());
        painel.put("totalOrganizacoes", organizacaoRepository.count());
        painel.put("statusSistema", "Operacional e Seguro");

        return ResponseEntity.ok(painel);
    }

    // Rota de Internacionalização básica
    @GetMapping("/idioma/{lang}")
    public ResponseEntity<Map<String, String>> getTextosInterface(@PathVariable String lang) {
        Map<String, String> textos = new HashMap<>();

        if ("es".equalsIgnoreCase(lang)) {
            textos.put("boasVindas", "Bienvenido a AR Help");
            textos.put("botaoRefugiado", "Soy Refugiado");
            textos.put("botaoOng", "Soy una Organización");
        } else if ("en".equalsIgnoreCase(lang)) {
            textos.put("boasVindas", "Welcome to AR Help");
            textos.put("botaoRefugiado", "I am a Refugee");
            textos.put("botaoOng", "I am an Organization");
        } else { // Padrão Português
            textos.put("boasVindas", "Bem-vindo ao AR Help");
            textos.put("botaoRefugiado", "Sou Refugiado");
            textos.put("botaoOng", "Sou uma Organização");
        }

        return ResponseEntity.ok(textos);
    }
}