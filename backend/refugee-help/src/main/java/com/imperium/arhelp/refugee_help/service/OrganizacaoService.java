package com.imperium.arhelp.refugee_help.service;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import com.imperium.arhelp.refugee_help.repository.OrganizacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrganizacaoService {

    @Autowired
    private OrganizacaoRepository repository;

    // Função 1
    public Organizacao salvar(Organizacao org) {
        return repository.save(org);
    }

    // Função 2
    public List<Organizacao> listarTodas() {
        return repository.findAll();
    }

    // Função 3
    public List<Organizacao> buscarPorTipo(String tipo) {
        return repository.findByTipoContainingIgnoreCase(tipo);
    }

    // Função 4
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Organização não encontrada para exclusão.");
        }
        repository.deleteById(id);
    }
}