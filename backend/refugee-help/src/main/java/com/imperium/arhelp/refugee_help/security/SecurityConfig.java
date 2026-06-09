package com.imperium.arhelp.refugee_help.security;

import com.imperium.arhelp.refugee_help.model.Organizacao;
import com.imperium.arhelp.refugee_help.repository.OrganizacaoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            OrganizacaoRepository organizacaoRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username:admin@arhelp.org}") String adminUsername,
            @Value("${app.admin.password:changeit}") String adminPassword
    ) {
        return username -> {
            if (adminUsername != null && adminUsername.equalsIgnoreCase(username)) {
                UserDetails admin = User.withUsername(adminUsername)
                        .password(passwordEncoder.encode(adminPassword))
                        .roles("ADMIN")
                        .build();
                return admin;
            }

            Organizacao org = organizacaoRepository.findByEmail(username.trim().toLowerCase())
                    .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

            return User.withUsername(org.getEmail())
                    .password(org.getSenha())
                    .roles("ORG")
                    .build();
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/plataforma/estatisticas").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/plataforma/idioma/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/refugiados").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/organizacoes").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/organizacoes/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/organizacoes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/organizacoes/busca").permitAll()

                        .requestMatchers("/api/plataforma/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/refugiados/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/organizacoes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/refugiados/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/refugiados/**").hasAnyRole("ADMIN", "ORG")

                        .anyRequest().authenticated()
                );

        return http.build();
    }
}

