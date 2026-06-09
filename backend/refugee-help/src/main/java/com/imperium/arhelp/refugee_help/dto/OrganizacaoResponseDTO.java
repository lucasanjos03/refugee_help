package com.imperium.arhelp.refugee_help.dto;

import java.util.List;

public class OrganizacaoResponseDTO {
    private Long id;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private String tipo;
    private String descricao;
    private List<String> servicos;
    private String horarioFuncionamento;
    private String telefone;
    private String email;
    private String website;
    private String idiomasAtendimento;
    private String cep;
    private String estado;
    private String cidade;
    private String bairro;
    private String enderecoCompleto;

    public OrganizacaoResponseDTO() {
    }

    public OrganizacaoResponseDTO(
            Long id,
            String razaoSocial,
            String nomeFantasia,
            String cnpj,
            String tipo,
            String descricao,
            List<String> servicos,
            String horarioFuncionamento,
            String telefone,
            String email,
            String website,
            String idiomasAtendimento,
            String cep,
            String estado,
            String cidade,
            String bairro,
            String enderecoCompleto
    ) {
        this.id = id;
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.tipo = tipo;
        this.descricao = descricao;
        this.servicos = servicos;
        this.horarioFuncionamento = horarioFuncionamento;
        this.telefone = telefone;
        this.email = email;
        this.website = website;
        this.idiomasAtendimento = idiomasAtendimento;
        this.cep = cep;
        this.estado = estado;
        this.cidade = cidade;
        this.bairro = bairro;
        this.enderecoCompleto = enderecoCompleto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<String> getServicos() {
        return servicos;
    }

    public void setServicos(List<String> servicos) {
        this.servicos = servicos;
    }

    public String getHorarioFuncionamento() {
        return horarioFuncionamento;
    }

    public void setHorarioFuncionamento(String horarioFuncionamento) {
        this.horarioFuncionamento = horarioFuncionamento;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getIdiomasAtendimento() {
        return idiomasAtendimento;
    }

    public void setIdiomasAtendimento(String idiomasAtendimento) {
        this.idiomasAtendimento = idiomasAtendimento;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getEnderecoCompleto() {
        return enderecoCompleto;
    }

    public void setEnderecoCompleto(String enderecoCompleto) {
        this.enderecoCompleto = enderecoCompleto;
    }
}

