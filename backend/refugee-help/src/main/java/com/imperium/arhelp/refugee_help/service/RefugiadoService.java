package com.imperium.arhelp.refugee_help.service;

import com.imperium.arhelp.refugee_help.model.Refugiado;
import com.imperium.arhelp.refugee_help.repository.RefugiadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RefugiadoService {

    @Autowired
    private RefugiadoRepository repository;

    // Função 5: Cadastrar refugiado (CRUD)
    public Refugiado salvar(Refugiado refugiado) {
        return repository.save(refugiado);
    }

    // Função 6: Listar todos os refugiados cadastrados
    public List<Refugiado> listarTodos() {
        return repository.findAll();
    }

    // Função 7: Buscar por ID com tratamento de erro customizado
    public Refugiado buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Refugiado com o ID " + id + " não foi encontrado."));
    }

    // Função 8: Atualizar dados (PUT)
    public Refugiado atualizar(Long id, Refugiado dadosNovos) {
        Refugiado existente = buscarPorId(id);

        existente.setNomeCompleto(dadosNovos.getNomeCompleto());
        existente.setTelefone(dadosNovos.getTelefone());
        existente.setEstado(dadosNovos.getEstado());
        existente.setCidade(dadosNovos.getCidade());
        existente.setEnderecoCompleto(dadosNovos.getEnderecoCompleto());
        existente.setNecessidades(dadosNovos.getNecessidades());
        existente.setRelatoSituacao(dadosNovos.getRelatoSituacao());

        return repository.save(existente);
    }
}
