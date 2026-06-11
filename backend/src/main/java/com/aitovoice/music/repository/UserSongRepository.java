package com.aitovoice.music.repository;

import com.aitovoice.music.entity.UserSong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserSongRepository extends JpaRepository<UserSong, Long> {

    @Query("SELECT us FROM UserSong us WHERE us.user.id = :userId AND us.type = :type AND us.deletedAt IS NULL ORDER BY us.lastPlayedAt DESC")
    Page<UserSong> findByUserIdAndType(@Param("userId") Long userId, @Param("type") UserSong.UserSongType type, Pageable pageable);

    Optional<UserSong> findByUserIdAndSongIdAndType(Long userId, Long songId, UserSong.UserSongType type);

    boolean existsByUserIdAndSongIdAndType(Long userId, Long songId, UserSong.UserSongType type);
}
