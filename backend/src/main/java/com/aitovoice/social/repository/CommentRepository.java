package com.aitovoice.social.repository;

import com.aitovoice.social.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findBySongIdAndParentIsNullAndDeletedAtIsNullOrderByCreatedAtDesc(Long songId, Pageable pageable);
    Page<Comment> findByParentIdAndDeletedAtIsNullOrderByCreatedAtAsc(Long parentId, Pageable pageable);
}
