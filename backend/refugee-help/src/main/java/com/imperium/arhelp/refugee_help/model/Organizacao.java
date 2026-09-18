package com.imperium.arhelp.refugee_help.model;

import jakarta.persistence.*;
import jakarta.persistence.ElementCollection;
import java.util.List;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "organizacoes")
public class Organizacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String razaoSocial;
    private String nomeFantasia;

    @Column(unique = true)
    private String cnpj;

    private String tipo; // ONG, Fundação, etc.
    private String descricao;

    @NotBlank
    @Size(min = 6)
    private String senha;

    // Serviços oferecidos (Checkbox na sua pauta)
    //private String servicos;
    @ElementCollection
    private List<String> servicos;

    // Funcionamento
    private String horarioFuncionamento;
    private String telefone;
    @NotBlank
    @Email
    private String email;
    private String website;
    private String idiomasAtendimento;

    // Endereço
    private String cep;
    private String estado;
    private String cidade;
    private String bairro;
    private String enderecoCompleto;

    // Getters e Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    //public String getServicos() { return servicos; }
    //public void setServicos(String servicos) { this.servicos = servicos; }

    public List<String> getServicos() { return servicos; }
    public void setServicos(List<String> servicos) { this.servicos = servicos; }

    public String getHorarioFuncionamento() { return horarioFuncionamento; }
    public void setHorarioFuncionamento(String horarioFuncionamento) { this.horarioFuncionamento = horarioFuncionamento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getIdiomasAtendimento() { return idiomasAtendimento; }
    public void setIdiomasAtendimento(String idiomasAtendimento) { this.idiomasAtendimento = idiomasAtendimento; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getEnderecoCompleto() { return enderecoCompleto; }
    public void setEnderecoCompleto(String enderecoCompleto) { this.enderecoCompleto = enderecoCompleto; }

}
