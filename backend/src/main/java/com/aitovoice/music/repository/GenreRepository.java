package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findAllByOrderBySortOrderAsc();
    Optional<Genre> findByName(String name);
}
