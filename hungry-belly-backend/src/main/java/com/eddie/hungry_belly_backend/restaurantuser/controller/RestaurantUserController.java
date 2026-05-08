package com.eddie.hungry_belly_backend.restaurantuser.controller;

import com.eddie.hungry_belly_backend.auth.service.RestaurantAuthorizationService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.restaurantuser.dto.request.AddMemberRequest;
import com.eddie.hungry_belly_backend.restaurantuser.dto.request.ChangeMemberRoleRequest;
import com.eddie.hungry_belly_backend.restaurantuser.dto.request.TransferOwnerRequest;
import com.eddie.hungry_belly_backend.restaurantuser.dto.response.RestaurantMemberResponse;
import com.eddie.hungry_belly_backend.restaurantuser.dto.response.UserRestaurantResponse;
import com.eddie.hungry_belly_backend.restaurantuser.service.RestaurantUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurant Membership", description = "Endpoints for managing restaurant members and roles")
public class RestaurantUserController {
    private final RestaurantUserService restaurantUserService;
    private final RestaurantAuthorizationService authz;

    @Operation(summary = "List restaurant members", description = "Returns all members for a specific restaurant.")
    @GetMapping("/{restaurantId}/members")
    public ResponseEntity<ApiResponse<?>> getMembers(@PathVariable Long restaurantId) {
        List<RestaurantMemberResponse> restaurantMembers = restaurantUserService.getRestaurantMembers(restaurantId);
        ApiResponse<?> body = ApiResponse.success(restaurantMembers, "Members fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Add restaurant member", description = "Adds a user as a member of a restaurant with the given role.")
    @PostMapping("/{restaurantId}/members")
    public ResponseEntity<ApiResponse<?>> addMember(
            @PathVariable Long restaurantId,
            @RequestBody @Valid AddMemberRequest request
    ) {
        RestaurantMemberResponse member = restaurantUserService.addMember(restaurantId, request);
        ApiResponse<?> body = ApiResponse.create(member, "Member added");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Change member role", description = "Updates role of an existing restaurant membership.")
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


    @Operation(summary = "Remove member", description = "Removes a user membership from a restaurant.")
    @DeleteMapping("/{restaurantId}/members/{membershipId}")
    public ResponseEntity<ApiResponse<?>> removeMember(@PathVariable Long restaurantId, @PathVariable Long membershipId) {
        restaurantUserService.removeMember(restaurantId, membershipId);
        ApiResponse<?> body = ApiResponse.success(null, "Member removed");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "List my restaurants", description = "Returns restaurants associated with the authenticated user.")
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<?>> getMyRestaurants() {
        Long currentUserId = authz.currentUserId();
        List<UserRestaurantResponse> restaurants = restaurantUserService.getCurrentUserRequests(currentUserId);
        ApiResponse<?> body = ApiResponse.success(restaurants, "Get my restaurants");
        return ResponseEntity.status(body.getStatus()).body(body);
    }


    @PostMapping("/{restaurantId}/transfer-ownership")
    public ResponseEntity<ApiResponse<?>> transferOwnership(@PathVariable Long restaurantId, @RequestBody TransferOwnerRequest request) {
        restaurantUserService.transferOwner(restaurantId, request);
        ApiResponse<?> body = ApiResponse.done(null,"Ownership transferred");
        return ResponseEntity.status(body.getStatus()).body(body);
    }



}
