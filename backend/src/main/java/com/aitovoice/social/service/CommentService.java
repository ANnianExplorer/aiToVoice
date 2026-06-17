package com.aitovoice.social.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.social.dto.CommentDto;
import com.aitovoice.social.dto.CreateCommentRequest;
import com.aitovoice.social.entity.Comment;
import com.aitovoice.social.repository.CommentRepository;
import com.aitovoice.music.entity.Song;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    @Transactional
    public CommentDto create(Long userId, Long songId, CreateCommentRequest request) {
        var comment = Comment.builder()
                .user(User.builder().id(userId).build())
                .song(Song.builder().id(songId).build())
                .content(request.content())
                .parent(request.parentId() != null ? Comment.builder().id(request.parentId()).build() : null)
                .build();
        commentRepository.save(comment);
        return toDto(comment);
    }

    @Transactional(readOnly = true)
    public Page<CommentDto> getBySong(Long songId, int page, int size) {
        return commentRepository.findBySongIdAndParentIsNullAndDeletedAtIsNullOrderByCreatedAtDesc(
                songId, PageRequest.of(page, size)).map(this::toDto);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        var comment = commentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        if (!comment.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        comment.softDelete();
        commentRepository.save(comment);
    }

    private CommentDto toDto(Comment c) {
        return new CommentDto(
                c.getId(), c.getUser().getId(), c.getUser().getUsername(),
                c.getUser().getAvatarUrl(), c.getSong().getId(),
                c.getParent() != null ? c.getParent().getId() : null,
                c.getContent(), c.getLikesCount(), c.getCreatedAt());
    }
}
