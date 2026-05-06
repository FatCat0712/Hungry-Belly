package com.eddie.hungry_belly_backend.restaurantuser.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransferOwnerRequest {
    @NotNull(message = "New owner userId is required")
    private Long newOwnerId;
}
