package com.aitovoice.social;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.social.dto.CommentDto;
import com.aitovoice.social.dto.CreateCommentRequest;
import com.aitovoice.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/songs/{songId}/comments")
    public ApiResponse<Page<CommentDto>> getBySong(
            @PathVariable Long songId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(commentService.getBySong(songId, page, size));
    }

    @PostMapping("/songs/{songId}/comments")
    public ApiResponse<CommentDto> create(
            @AuthenticationPrincipal User user,
            @PathVariable Long songId,
            @Valid @RequestBody CreateCommentRequest request) {
        return ApiResponse.success(commentService.create(user.getId(), songId, request));
    }

    @DeleteMapping("/comments/{id}")
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        commentService.delete(id, user.getId());
        return ApiResponse.success(null);
    }
}
