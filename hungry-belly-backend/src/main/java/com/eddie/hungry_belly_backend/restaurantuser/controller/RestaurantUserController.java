package com.eddie.hungry_belly_backend.restaurantuser.controller;

import com.eddie.hungry_belly_backend.auth.service.RestaurantAuthorizationService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.restaurantuser.dto.request.AddMemberRequest;
import com.eddie.hungry_belly_backend.restaurantuser.dto.request.ChangeMemberRoleRequest;
import com.eddie.hungry_belly_backend.restaurantuser.dto.response.RestaurantMemberResponse;
import com.eddie.hungry_belly_backend.restaurantuser.service.RestaurantUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/restaurants")
@RequiredArgsConstructor
public class RestaurantUserController {
    private final RestaurantUserService restaurantUserService;
    private final RestaurantAuthorizationService authz;

    @GetMapping("/{restaurantId}/members")
    public ResponseEntity<ApiResponse<?>> getMembers(@PathVariable Long restaurantId) {
        List<RestaurantMemberResponse> restaurantMembers = restaurantUserService.getRestaurantMembers(restaurantId);
        ApiResponse<?> body = ApiResponse.success(restaurantMembers, "Members fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PostMapping("/{restaurantId}/members")
    public ResponseEntity<ApiResponse<?>> addMember(
            @PathVariable Long restaurantId,
            @RequestBody @Valid AddMemberRequest request
    ) {
        RestaurantMemberResponse member = restaurantUserService.addMember(restaurantId, request);
        ApiResponse<?> body = ApiResponse.create(member, "Member added");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PatchMapping("/{restaurantId}/members/{membershipId}/role")
    public ResponseEntity<ApiResponse<?>> changeRole(
            @PathVariable Long restaurantId,
            @PathVariable Long membershipId,
            @Valid @RequestBody ChangeMemberRoleRequest request
    ) {
        RestaurantMemberResponse response = restaurantUserService.changeMemberRole(restaurantId, membershipId, request);
        ApiResponse<?> body = ApiResponse.success(response, "Member role updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }


    @DeleteMapping("/{restaurantId}/members/{membershipId}")
    public ResponseEntity<ApiResponse<?>> removeMember(@PathVariable Long restaurantId, @PathVariable Long membershipId) {
        restaurantUserService.removeMember(restaurantId, membershipId);
        ApiResponse<?> body = ApiResponse.success(null, "Member removed");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<?>> getMyRestaurants() {
        Long currentUserId = authz.currentUserId();
        List<RestaurantMemberResponse> restaurants = restaurantUserService.getRestaurantMembers(currentUserId);
        ApiResponse<?> body = ApiResponse.success(restaurants, "Get my restaurants");
        return ResponseEntity.status(body.getStatus()).body(body);
    }



}
