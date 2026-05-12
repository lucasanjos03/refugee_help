package com.imperium.arhelp.refugee_help.repository;

import com.imperium.arhelp.refugee_help.model.Refugiado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefugiadoRepository extends JpaRepository<Refugiado, Long> {
}
