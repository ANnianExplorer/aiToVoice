package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    @Query("SELECT p FROM Playlist p LEFT JOIN FETCH p.user WHERE p.user.id = :userId AND p.deletedAt IS NULL")
    List<Playlist> findByUserIdAndDeletedAtIsNull(Long userId);

    @Query("SELECT p FROM Playlist p LEFT JOIN FETCH p.user WHERE p.isPublic = true AND p.deletedAt IS NULL")
    List<Playlist> findByIsPublicTrueAndDeletedAtIsNull();
}
