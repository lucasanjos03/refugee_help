package com.imperium.arhelp.refugee_help.service;

import com.imperium.arhelp.refugee_help.dto.OrganizacaoResponseDTO;
import com.imperium.arhelp.refugee_help.exception.NotFoundException;
import com.imperium.arhelp.refugee_help.model.Organizacao;
import com.imperium.arhelp.refugee_help.repository.OrganizacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizacaoService {

    @Autowired
    private OrganizacaoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Função 1: Salvar/Cadastrar Organização
    public OrganizacaoResponseDTO salvar(Organizacao org) {
        if (org.getEmail() != null) {
            org.setEmail(org.getEmail().trim().toLowerCase());
        }
        if (org.getSenha() != null && !isBcryptHash(org.getSenha())) {
            org.setSenha(passwordEncoder.encode(org.getSenha()));
        }
        return toResponseDTO(repository.save(org));
    }

    // Função 2: Listar todas as organizações
    public List<OrganizacaoResponseDTO> listarTodas() {
        return repository.findAll().stream().map(this::toResponseDTO).toList();
    }

    // Função 3: Busca dinâmica por tipo (Ignorando Case)
    public List<OrganizacaoResponseDTO> buscarPorTipo(String tipo) {
        return repository.findByTipoContainingIgnoreCase(tipo).stream().map(this::toResponseDTO).toList();
    }

    // Função 4: Excluir organização por ID com validação de existência
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Organização não encontrada para exclusão.");
        }
        repository.deleteById(id);
    }

    // Buscar organização por e-mail (usado no fluxo de login)
    public Optional<Organizacao> buscarPorEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return repository.findByEmail(email.trim().toLowerCase());
    }

    public OrganizacaoResponseDTO toResponseDTO(Organizacao org) {
        if (org == null) {
            return null;
        }
        return new OrganizacaoResponseDTO(
                org.getId(),
                org.getRazaoSocial(),
                org.getNomeFantasia(),
                org.getCnpj(),
                org.getTipo(),
                org.getDescricao(),
                org.getServicos(),
                org.getHorarioFuncionamento(),
                org.getTelefone(),
                org.getEmail(),
                org.getWebsite(),
                org.getIdiomasAtendimento(),
                org.getCep(),
                org.getEstado(),
                org.getCidade(),
                org.getBairro(),
                org.getEnderecoCompleto()
        );
    }

    private static boolean isBcryptHash(String value) {
        if (value == null) {
            return false;
        }
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }
}
