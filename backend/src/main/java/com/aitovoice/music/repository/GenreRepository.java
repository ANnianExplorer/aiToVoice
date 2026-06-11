package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findAllByOrderBySortOrderAsc();
}
