package com.aitovoice.voice.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "ai_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class AiSession extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(length = 200)
    private String title;
    @Enumerated(EnumType.STRING)
    @Column(name = "session_type", nullable = false, length = 20)
    private SessionType sessionType;
    @Column(name = "context_data", columnDefinition = "JSON")
    private String contextData;
    @Column(length = 2000)
    private String summary;

    public enum SessionType { VOICE_COACH, GENERAL }
}
