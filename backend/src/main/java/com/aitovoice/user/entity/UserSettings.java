package com.aitovoice.user.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "user_settings")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE user_settings SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class UserSettings extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Theme theme = Theme.DARK;
    @Column(length = 10)
    @Builder.Default
    private String language = "zh-CN";
    @Column(name = "audio_output_device", length = 100)
    private String audioOutputDevice;
    @Column(name = "audio_quality", length = 20)
    @Builder.Default
    private String audioQuality = "HIGH";
    @Column(name = "crossfade_enabled")
    @Builder.Default
    private Boolean crossfadeEnabled = false;
    @Column(name = "crossfade_duration")
    @Builder.Default
    private Integer crossfadeDuration = 3;
    @Column(name = "hotkey_config", columnDefinition = "JSON")
    private String hotkeyConfig;
    @Column(name = "lyric_font_size")
    @Builder.Default
    private Integer lyricFontSize = 16;
    @Column(name = "lyric_desktop_enabled")
    @Builder.Default
    private Boolean lyricDesktopEnabled = false;
    @Column(name = "notification_enabled")
    @Builder.Default
    private Boolean notificationEnabled = true;
    @Column(name = "cache_max_mb")
    @Builder.Default
    private Integer cacheMaxMb = 1024;
    @Column(name = "auto_play_on_launch")
    @Builder.Default
    private Boolean autoPlayOnLaunch = false;

    public enum Theme { DARK, LIGHT, AUTO }
}
