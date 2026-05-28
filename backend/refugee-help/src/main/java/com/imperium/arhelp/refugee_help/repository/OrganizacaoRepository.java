package com.imperium.arhelp.refugee_help.repository;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizacaoRepository extends JpaRepository<Organizacao, Long> {

    // O método que você já tinha para a busca dinâmica
    List<Organizacao> findByTipoContainingIgnoreCase(String tipo);

    // O novo método que adicionamos para o fluxo de login
    Optional<Organizacao> findByEmail(String email);
}
