package com.eddie.hungry_belly_backend.email.service;

import com.eddie.hungry_belly_backend.email.repository.EmailVerificationRepository;
import com.eddie.hungry_belly_backend.entity.EmailVerification;
import com.eddie.hungry_belly_backend.entity.TokenType;
import com.eddie.hungry_belly_backend.entity.user.User;
import com.eddie.hungry_belly_backend.exception.common.InvalidTokenException;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final EmailVerificationRepository emailVerificationRepository;
    private final UserRepository userRepository;
    private final JavaMailSenderImpl mailSender;

    @Value("${api.prefix}")
    private String API;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void createEmailVerification(User user, String token) {
        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setUser(user);
        emailVerification.setToken(token);
        emailVerification.setTokenType(TokenType.EMAIL_VERIFICATION);
        emailVerification.setCreatedAt(LocalDateTime.now());
        emailVerification.setExpiresAt(LocalDateTime.now().plusHours(24));
        emailVerificationRepository.save(emailVerification);
        // Save the email verification to the database
    }

    public String activate(String token) {
        EmailVerification verification = emailVerificationRepository.findByTokenAndTokenType(token, TokenType.EMAIL_VERIFICATION)
                .orElseThrow(()-> new InvalidTokenException("Activation token not found"));
        if(!verification.isValid()) {
            throw new InvalidTokenException("Activation token expired or already used");
        }

        verification.setUsedAt(LocalDateTime.now());
        emailVerificationRepository.save(verification);

        User user = verification.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        return user.getFirstName();
    }

    public void sendVerificationEmail(User user, String token) {
        // Implement email sending logic here (e.g., using JavaMailSender)
        String html = loadTemplate("activation")
                .replace("{{logoUrl}}", "cid:logo")
                .replace("{{firstName}}", user.getFirstName())
                .replace("{{activationLink}}", "http://localhost:8080" + API + "/users/activate?token=" + token);
        // Construct the verification URL and send the email to the user

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Activate Your Hungry Belly Account");
            helper.setText(html, true);

            // attach the logo as an inline resource with content ID "logo"
            ClassPathResource logo = new ClassPathResource("static/images/logo.png");
            helper.addInline("logo", logo, "image/png");

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}: {}", user.getEmail(), e.getMessage());
        }


    }

    public String loadTemplate(String name) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/" + name + ".html");
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load email template: " + name, e);
        }
    }

    public String getLogoInBase64() {
        try {
            ClassPathResource resource = new ClassPathResource("static/images/logo.png");
            byte[] logoBytes = resource.getInputStream().readAllBytes();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(logoBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load logo image", e);
        }
    }
}
