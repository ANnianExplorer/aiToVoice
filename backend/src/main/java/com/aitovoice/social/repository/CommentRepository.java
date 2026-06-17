package com.aitovoice.social.repository;

import com.aitovoice.social.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findBySongIdAndParentIsNullAndDeletedAtIsNullOrderByCreatedAtDesc(Long songId, Pageable pageable);
    Page<Comment> findByParentIdAndDeletedAtIsNullOrderByCreatedAtAsc(Long parentId, Pageable pageable);

    @Modifying
    @Query("UPDATE Comment c SET c.likesCount = c.likesCount + 1 WHERE c.id = :id")
    int incrementLikesCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Comment c SET c.likesCount = c.likesCount - 1 WHERE c.id = :id AND c.likesCount > 0")
    int decrementLikesCount(@Param("id") Long id);
}
