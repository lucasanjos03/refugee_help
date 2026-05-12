package com.imperium.arhelp.refugee_help.repository;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrganizacaoRepository extends JpaRepository<Organizacao, Long> {
    List<Organizacao> findByTipoContainingIgnoreCase(String tipo);
}
