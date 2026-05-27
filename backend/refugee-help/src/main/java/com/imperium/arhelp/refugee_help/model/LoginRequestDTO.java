package com.imperium.arhelp.refugee_help.model; // Ajuste o pacote se preferir colocar em .dto

public class LoginRequestDTO {
    private String email;
    private String password;

    // Construtor padrão necessário para o Jackson do Spring
    public LoginRequestDTO() {
    }

    public LoginRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters e Setters (Resolvem o 'getEmail()' e 'getPassword()')
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
