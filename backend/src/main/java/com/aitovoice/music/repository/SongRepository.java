package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    @Modifying
    @Query("UPDATE Song s SET s.playCount = s.playCount + 1 WHERE s.id = :id")
    int incrementPlayCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Song s SET s.likeCount = s.likeCount + 1 WHERE s.id = :id")
    int incrementLikeCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Song s SET s.likeCount = s.likeCount - 1 WHERE s.id = :id AND s.likeCount > 0")
    int decrementLikeCount(@Param("id") Long id);
}
