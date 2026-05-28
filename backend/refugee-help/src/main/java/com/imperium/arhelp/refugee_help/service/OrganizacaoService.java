package com.imperium.arhelp.refugee_help.service;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import com.imperium.arhelp.refugee_help.repository.OrganizacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrganizacaoService {

    @Autowired
    private OrganizacaoRepository repository;

    // Função 1: Salvar/Cadastrar Organização
    public Organizacao salvar(Organizacao org) {
        return repository.save(org);
    }

    // Função 2: Listar todas as organizações
    public List<Organizacao> listarTodas() {
        return repository.findAll();
    }

    // Função 3: Busca dinâmica por tipo (Ignorando Case)
    public List<Organizacao> buscarPorTipo(String tipo) {
        return repository.findByTipoContainingIgnoreCase(tipo);
    }

    // Função 4: Excluir organização por ID com validação de existência
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Organização não encontrada para exclusão.");
        }
        repository.deleteById(id);
    }

    // Buscar organização por e-mail (usado no fluxo de login)
    public Optional<Organizacao> buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }
}