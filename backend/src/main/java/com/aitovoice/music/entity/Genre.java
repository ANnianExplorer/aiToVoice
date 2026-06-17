package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "genres")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE genres SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Genre extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50)
    private String name;
    @Column(length = 500)
    private String description;
    @Column(name = "cover_url")
    private String coverUrl;
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}
