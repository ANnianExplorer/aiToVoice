package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumRepository extends JpaRepository<Album, Long> {}
