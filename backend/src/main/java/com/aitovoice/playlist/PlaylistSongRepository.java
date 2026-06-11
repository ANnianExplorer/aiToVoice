package com.aitovoice.playlist;

import com.aitovoice.playlist.entity.PlaylistSong;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, Long> {
    List<PlaylistSong> findByPlaylistIdOrderBySortOrder(Long playlistId);
    Optional<PlaylistSong> findByPlaylistIdAndSongId(Long playlistId, Long songId);
    void deleteByPlaylistIdAndSongId(Long playlistId, Long songId);
}
