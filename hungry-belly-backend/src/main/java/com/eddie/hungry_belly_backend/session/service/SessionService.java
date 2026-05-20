package com.eddie.hungry_belly_backend.session.service;

import com.eddie.hungry_belly_backend.entity.user.User;
import com.eddie.hungry_belly_backend.entity.user.UserSession;
import com.eddie.hungry_belly_backend.session.repository.SessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class SessionService {
    private final SessionRepository sessionRepository;

//    Called at login - creates a fresh session
    public UserSession createSession(User user, HttpServletRequest request) {
        UserSession session = new UserSession();
        session.setUser(user);
        session.setIpAddress(request.getRemoteAddr());
        session.setUserAgent(request.getHeader("User-Agent"));
        return sessionRepository.save(session);
    }

    public void invalidateSession(UserSession session) {
        if (session == null || !session.isValid()) {
            return;
        }

        session.setValid(false);
        session.setInvalidatedAt(Instant.now());
        sessionRepository.save(session);
    }



}
