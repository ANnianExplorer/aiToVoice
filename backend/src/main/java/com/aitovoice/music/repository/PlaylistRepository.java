package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUserIdAndDeletedAtIsNull(Long userId);
    List<Playlist> findByIsPublicTrueAndDeletedAtIsNull();
}
