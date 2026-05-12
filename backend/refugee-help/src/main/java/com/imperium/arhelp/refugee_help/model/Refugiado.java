package com.imperium.arhelp.refugee_help.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "refugiados")
public class Refugiado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nomeCompleto;

    private String nacionalidade;
    private LocalDate dataNascimento;
    private String genero;
    private String documentoIdentificacao;
    private Integer numFamiliares;
    private String telefone;
    private String estado;
    private String cidade;
    private String enderecoCompleto;

    @Column(columnDefinition = "TEXT")
    private String necessidades;

    @Column(columnDefinition = "TEXT")
    private String relatoSituacao;

    // Construtor
    public Refugiado() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }

    public String getNacionalidade() { return nacionalidade; }
    public void setNacionalidade(String nacionalidade) { this.nacionalidade = nacionalidade; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getDocumentoIdentificacao() { return documentoIdentificacao; }
    public void setDocumentoIdentificacao(String documentoIdentificacao) { this.documentoIdentificacao = documentoIdentificacao; }

    public Integer getNumFamiliares() { return numFamiliares; }
    public void setNumFamiliares(Integer numFamiliares) {this.numFamiliares = numFamiliares; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getNacionalidade() { return nacionalidade; }
    public void setNacionalidade(String nacionalidade) { this.nacionalidade = nacionalidade; }

    public String getEnderecoCompleto() { return enderecoCompleto; }
    public void setEnderecoCompleto(String enderecoCompleto) { this.enderecoCompleto = enderecoCompleto; }



    public String getNecessidades() { return necessidades; }
    public void setNecessidades(String necessidades) { this.necessidades = necessidades; }

    public String getRelatoSituacao() { return relatoSituacao; }
    public void setRelatoSituacao(String relatoSituacao) { this.relatoSituacao = relatoSituacao; }

}
