package com.aitovoice.social;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{id}/follow")
    public ApiResponse<Void> follow(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        followService.follow(user.getId(), id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/follow")
    public ApiResponse<Void> unfollow(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        followService.unfollow(user.getId(), id);
        return ApiResponse.success(null);
    }

    @GetMapping("/{id}/follow-stats")
    public ApiResponse<Map<String, Long>> followStats(@PathVariable Long id) {
        return ApiResponse.success(followService.getFollowStats(id));
    }
}
