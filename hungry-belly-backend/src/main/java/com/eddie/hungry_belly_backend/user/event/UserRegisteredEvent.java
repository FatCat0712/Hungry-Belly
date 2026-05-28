package com.eddie.hungry_belly_backend.user.event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisteredEvent {

    public UserRegisteredEvent(String firstName, String email, String activationToken) {
        this.firstName = firstName;
        this.email = email;
        this.activationToken = activationToken;
    }

    private String firstName;
    private String email;
    private String activationToken;
}
