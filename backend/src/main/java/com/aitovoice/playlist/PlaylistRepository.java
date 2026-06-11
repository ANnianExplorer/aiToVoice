package com.aitovoice.playlist;

import com.aitovoice.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUserIdAndDeletedAtIsNull(Long userId);
    List<Playlist> findByIsPublicTrueAndDeletedAtIsNull();
}
