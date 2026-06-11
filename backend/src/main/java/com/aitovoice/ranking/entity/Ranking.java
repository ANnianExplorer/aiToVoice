package com.aitovoice.ranking.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.music.entity.Genre;
import com.aitovoice.music.entity.Song;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "rankings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ranking extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RankingType type;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Period period;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;
    @Column(name = "rank_position", nullable = false)
    private Integer rankPosition;
    @Column
    private Double score;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;
    @Column(name = "snapshot_date")
    private LocalDate snapshotDate;

    public enum RankingType { HOT, NEW, RISING, GENRE }
    public enum Period { DAILY, WEEKLY, MONTHLY }
}
