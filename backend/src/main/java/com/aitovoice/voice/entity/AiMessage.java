package com.aitovoice.voice.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "ai_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class AiMessage extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private AiSession session;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MessageRole role;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Enumerated(EnumType.STRING)
    @Column(name = "msg_type", length = 30)
    @Builder.Default
    private MessageType msgType = MessageType.TEXT;
    @Column(columnDefinition = "JSON")
    private String metadata;

    public enum MessageRole { USER, ASSISTANT }
    public enum MessageType { TEXT, AUDIO_ANALYSIS, EXERCISE_SUGGEST }
}
