package com.aitovoice.music;

import com.aitovoice.music.entity.Lyrics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LyricsRepository extends JpaRepository<Lyrics, Long> {
    Optional<Lyrics> findBySongId(Long songId);
}
