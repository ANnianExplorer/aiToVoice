package com.aitovoice.social.repository;

import com.aitovoice.social.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.song WHERE c.song.id = :songId AND c.parent IS NULL AND c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findBySongIdAndParentIsNullAndDeletedAtIsNullOrderByCreatedAtDesc(@Param("songId") Long songId, Pageable pageable);

    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.user WHERE c.parent.id = :parentId AND c.deletedAt IS NULL ORDER BY c.createdAt ASC")
    Page<Comment> findByParentIdAndDeletedAtIsNullOrderByCreatedAtAsc(@Param("parentId") Long parentId, Pageable pageable);

    @Modifying
    @Query("UPDATE Comment c SET c.likesCount = c.likesCount + 1 WHERE c.id = :id")
    int incrementLikesCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Comment c SET c.likesCount = c.likesCount - 1 WHERE c.id = :id AND c.likesCount > 0")
    int decrementLikesCount(@Param("id") Long id);
}
