package com.aitovoice.music;

import com.aitovoice.music.entity.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    @Query("SELECT s FROM Song s WHERE s.deletedAt IS NULL AND s.title LIKE %:keyword%")
    Page<Song> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT s FROM Song s WHERE s.deletedAt IS NULL ORDER BY s.playCount DESC")
    List<Song> findHotSongs(Pageable pageable);

    @Query("SELECT s FROM Song s WHERE s.deletedAt IS NULL ORDER BY s.createdAt DESC")
    List<Song> findNewSongs(Pageable pageable);

    @Query("SELECT s FROM Song s WHERE s.deletedAt IS NULL AND s.genre.id = :genreId ORDER BY s.playCount DESC")
    List<Song> findByGenreId(@Param("genreId") Long genreId, Pageable pageable);
}
