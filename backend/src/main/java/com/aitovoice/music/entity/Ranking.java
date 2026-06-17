package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDate;

@Entity
@Table(name = "rankings")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE rankings SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
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
