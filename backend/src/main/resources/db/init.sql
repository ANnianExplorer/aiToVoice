-- ============================================================
-- AiToVoice Database Initialization Script
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS aitovoice
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE aitovoice;

-- ============================================================
-- 1. users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    username      VARCHAR(50)  NOT NULL,
    email         VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url    VARCHAR(500)          DEFAULT NULL,
    nickname      VARCHAR(50)           DEFAULT NULL,
    bio           VARCHAR(500)          DEFAULT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    DATETIME              DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User accounts';

-- ============================================================
-- 2. user_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
    id                     BIGINT       NOT NULL AUTO_INCREMENT,
    user_id                BIGINT       NOT NULL,
    theme                  VARCHAR(20)           DEFAULT 'DARK',
    language               VARCHAR(10)           DEFAULT 'zh-CN',
    audio_output_device    VARCHAR(100)          DEFAULT NULL,
    audio_quality          VARCHAR(20)           DEFAULT 'HIGH',
    crossfade_enabled      TINYINT(1)            DEFAULT 0,
    crossfade_duration     INT                   DEFAULT 3,
    hotkey_config          JSON                  DEFAULT NULL,
    lyric_font_size        INT                   DEFAULT 16,
    lyric_desktop_enabled  TINYINT(1)            DEFAULT 0,
    notification_enabled   TINYINT(1)            DEFAULT 1,
    cache_max_mb           INT                   DEFAULT 1024,
    auto_play_on_launch    TINYINT(1)            DEFAULT 0,
    created_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at             DATETIME              DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_settings_user (user_id),
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Per-user application preferences';

-- ============================================================
-- 3. artists
-- ============================================================
CREATE TABLE IF NOT EXISTS artists (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    avatar_url  VARCHAR(500)          DEFAULT NULL,
    bio         VARCHAR(1000)         DEFAULT NULL,
    source_type VARCHAR(20)           DEFAULT NULL,
    source_id   VARCHAR(100)          DEFAULT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME              DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_artists_name (name),
    INDEX idx_artists_source (source_type, source_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Music artists';

-- ============================================================
-- 4. albums
-- ============================================================
CREATE TABLE IF NOT EXISTS albums (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    title        VARCHAR(200)  NOT NULL,
    artist_id    BIGINT                 DEFAULT NULL,
    cover_url    VARCHAR(500)           DEFAULT NULL,
    release_date DATE                   DEFAULT NULL,
    description  VARCHAR(1000)          DEFAULT NULL,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME               DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_albums_artist (artist_id),
    INDEX idx_albums_title (title),
    CONSTRAINT fk_albums_artist FOREIGN KEY (artist_id) REFERENCES artists(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Music albums';

-- ============================================================
-- 5. genres
-- ============================================================
CREATE TABLE IF NOT EXISTS genres (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50)  NOT NULL,
    description VARCHAR(500)          DEFAULT NULL,
    cover_url   VARCHAR(500)          DEFAULT NULL,
    sort_order  INT                   DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME              DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_genres_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Music genres / categories';

-- ============================================================
-- 6. songs
-- ============================================================
CREATE TABLE IF NOT EXISTS songs (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    title       VARCHAR(200)  NOT NULL,
    artist_id   BIGINT                 DEFAULT NULL,
    album_id    BIGINT                 DEFAULT NULL,
    genre_id    BIGINT                 DEFAULT NULL,
    duration    INT           NOT NULL,
    file_path   VARCHAR(500)           DEFAULT NULL,
    cover_url   VARCHAR(500)           DEFAULT NULL,
    source_type VARCHAR(20)   NOT NULL,
    source_id   VARCHAR(100)           DEFAULT NULL,
    play_count  BIGINT                 DEFAULT 0,
    like_count  BIGINT                 DEFAULT 0,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME               DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_song_title (title),
    INDEX idx_song_artist (artist_id),
    INDEX idx_song_genre (genre_id),
    INDEX idx_song_album (album_id),
    INDEX idx_song_source (source_type, source_id),
    CONSTRAINT fk_songs_artist FOREIGN KEY (artist_id) REFERENCES artists(id),
    CONSTRAINT fk_songs_album  FOREIGN KEY (album_id)  REFERENCES albums(id),
    CONSTRAINT fk_songs_genre  FOREIGN KEY (genre_id)  REFERENCES genres(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Music tracks';

-- ============================================================
-- 7. tags
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    name       VARCHAR(50) NOT NULL,
    color      VARCHAR(20)          DEFAULT NULL,
    user_id    BIGINT               DEFAULT NULL,
    created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME             DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_tags_user (user_id),
    CONSTRAINT fk_tags_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User-defined tags for songs';

-- ============================================================
-- 8. song_tags  (composite PK, no soft-delete)
-- ============================================================
CREATE TABLE IF NOT EXISTS song_tags (
    song_id BIGINT NOT NULL,
    tag_id  BIGINT NOT NULL,
    PRIMARY KEY (song_id, tag_id),
    INDEX idx_song_tags_tag (tag_id),
    CONSTRAINT fk_song_tags_song FOREIGN KEY (song_id) REFERENCES songs(id),
    CONSTRAINT fk_song_tags_tag  FOREIGN KEY (tag_id)  REFERENCES tags(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Many-to-many relation between songs and tags';

-- ============================================================
-- 9. lyrics
-- ============================================================
CREATE TABLE IF NOT EXISTS lyrics (
    id         BIGINT   NOT NULL AUTO_INCREMENT,
    song_id    BIGINT            DEFAULT NULL,
    content    TEXT              DEFAULT NULL,
    source     VARCHAR(50)       DEFAULT NULL,
    synced_at  DATETIME          DEFAULT NULL,
    created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME          DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_lyrics_song (song_id),
    CONSTRAINT fk_lyrics_song FOREIGN KEY (song_id) REFERENCES songs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lyrics for songs';

-- ============================================================
-- 10. user_songs
-- ============================================================
CREATE TABLE IF NOT EXISTS user_songs (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    user_id        BIGINT      NOT NULL,
    song_id        BIGINT      NOT NULL,
    type           VARCHAR(20) NOT NULL,
    play_count     INT                  DEFAULT 0,
    last_played_at DATETIME             DEFAULT NULL,
    progress_sec   INT                  DEFAULT 0,
    created_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at     DATETIME             DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_songs (user_id, song_id, type),
    INDEX idx_user_songs_user (user_id),
    INDEX idx_user_songs_song (song_id),
    CONSTRAINT fk_user_songs_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_songs_song FOREIGN KEY (song_id) REFERENCES songs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User-song relations (favorites, history, etc.)';

-- ============================================================
-- 11. playlists
-- ============================================================
CREATE TABLE IF NOT EXISTS playlists (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    user_id     BIGINT        NOT NULL,
    name        VARCHAR(200)  NOT NULL,
    description VARCHAR(1000)          DEFAULT NULL,
    cover_url   VARCHAR(500)           DEFAULT NULL,
    is_public   TINYINT(1)            DEFAULT 1,
    play_count  BIGINT                 DEFAULT 0,
    song_count  INT                   DEFAULT 0,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME               DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_playlists_user (user_id),
    CONSTRAINT fk_playlists_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User playlists';

-- ============================================================
-- 12. playlist_songs
-- ============================================================
CREATE TABLE IF NOT EXISTS playlist_songs (
    id          BIGINT   NOT NULL AUTO_INCREMENT,
    playlist_id BIGINT   NOT NULL,
    song_id     BIGINT   NOT NULL,
    sort_order  INT               DEFAULT 0,
    added_at    DATETIME          DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_playlist_songs (playlist_id, song_id),
    INDEX idx_playlist_songs_song (song_id),
    CONSTRAINT fk_playlist_songs_playlist FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    CONSTRAINT fk_playlist_songs_song     FOREIGN KEY (song_id)     REFERENCES songs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Songs in playlists with ordering';

-- ============================================================
-- 13. comments
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
    id          BIGINT   NOT NULL AUTO_INCREMENT,
    user_id     BIGINT   NOT NULL,
    song_id     BIGINT   NOT NULL,
    parent_id   BIGINT            DEFAULT NULL,
    content     TEXT              DEFAULT NULL,
    likes_count BIGINT            DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME          DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_comments_user (user_id),
    INDEX idx_comments_song (song_id),
    INDEX idx_comments_parent (parent_id),
    CONSTRAINT fk_comments_user   FOREIGN KEY (user_id)   REFERENCES users(id),
    CONSTRAINT fk_comments_song   FOREIGN KEY (song_id)   REFERENCES songs(id),
    CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id) REFERENCES comments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User comments on songs (supports replies)';

-- ============================================================
-- 14. messages
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    sender_id   BIGINT       NOT NULL,
    receiver_id BIGINT       NOT NULL,
    content     TEXT                  DEFAULT NULL,
    msg_type    VARCHAR(20)           DEFAULT 'TEXT',
    ref_id      BIGINT                DEFAULT NULL,
    is_read     TINYINT(1)            DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME              DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_messages_sender (sender_id),
    INDEX idx_messages_receiver (receiver_id),
    INDEX idx_messages_conversation (sender_id, receiver_id),
    CONSTRAINT fk_messages_sender   FOREIGN KEY (sender_id)   REFERENCES users(id),
    CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Private messages between users';

-- ============================================================
-- 15. user_follows
-- ============================================================
CREATE TABLE IF NOT EXISTS user_follows (
    id           BIGINT   NOT NULL AUTO_INCREMENT,
    follower_id  BIGINT   NOT NULL,
    following_id BIGINT   NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at   DATETIME          DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_follows (follower_id, following_id),
    INDEX idx_user_follows_following (following_id),
    CONSTRAINT fk_user_follows_follower  FOREIGN KEY (follower_id)  REFERENCES users(id),
    CONSTRAINT fk_user_follows_following FOREIGN KEY (following_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User follow / subscription relations';

-- ============================================================
-- 16. voice_records
-- ============================================================
CREATE TABLE IF NOT EXISTS voice_records (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    user_id          BIGINT       NOT NULL,
    song_id          BIGINT                DEFAULT NULL,
    file_path        VARCHAR(500) NOT NULL,
    duration_sec     INT                   DEFAULT NULL,
    pitch_data       JSON                  DEFAULT NULL,
    rhythm_data      JSON                  DEFAULT NULL,
    score            INT                   DEFAULT NULL,
    comparison_data  JSON                  DEFAULT NULL,
    feedback_text    TEXT                  DEFAULT NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at       DATETIME              DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_voice_records_user (user_id),
    INDEX idx_voice_records_song (song_id),
    CONSTRAINT fk_voice_records_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_voice_records_song FOREIGN KEY (song_id) REFERENCES songs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User voice recording sessions';

-- ============================================================
-- 17. voice_exercises
-- ============================================================
CREATE TABLE IF NOT EXISTS voice_exercises (
    id                 BIGINT        NOT NULL AUTO_INCREMENT,
    title              VARCHAR(200)  NOT NULL,
    description        VARCHAR(1000)          DEFAULT NULL,
    type               VARCHAR(20)   NOT NULL,
    difficulty         INT           NOT NULL,
    audio_example_path VARCHAR(500)           DEFAULT NULL,
    instructions       TEXT                   DEFAULT NULL,
    target_metrics     JSON                   DEFAULT NULL,
    duration_sec       INT                    DEFAULT NULL,
    sort_order         INT                    DEFAULT 0,
    created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at         DATETIME               DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_voice_exercises_type (type),
    INDEX idx_voice_exercises_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Vocal training exercises';

-- ============================================================
-- 18. user_practice_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS user_practice_progress (
    id               BIGINT      NOT NULL AUTO_INCREMENT,
    user_id          BIGINT      NOT NULL,
    exercise_id      BIGINT      NOT NULL,
    voice_record_id  BIGINT               DEFAULT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    attempts_count   INT                  DEFAULT 0,
    best_score       INT                  DEFAULT NULL,
    latest_score     INT                  DEFAULT NULL,
    practice_minutes INT                  DEFAULT 0,
    notes            TEXT                 DEFAULT NULL,
    started_at       DATETIME             DEFAULT NULL,
    completed_at     DATETIME             DEFAULT NULL,
    created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at       DATETIME             DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_practice (user_id, exercise_id),
    INDEX idx_user_practice_user (user_id),
    INDEX idx_user_practice_exercise (exercise_id),
    INDEX idx_user_practice_status (status),
    CONSTRAINT fk_user_practice_user     FOREIGN KEY (user_id)         REFERENCES users(id),
    CONSTRAINT fk_user_practice_exercise FOREIGN KEY (exercise_id)     REFERENCES voice_exercises(id),
    CONSTRAINT fk_user_practice_record   FOREIGN KEY (voice_record_id) REFERENCES voice_records(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tracks user progress on voice exercises';

-- ============================================================
-- 19. ai_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_sessions (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    user_id      BIGINT        NOT NULL,
    title        VARCHAR(200)           DEFAULT NULL,
    session_type VARCHAR(20)   NOT NULL,
    context_data JSON                   DEFAULT NULL,
    summary      VARCHAR(2000)          DEFAULT NULL,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME               DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_ai_sessions_user (user_id),
    CONSTRAINT fk_ai_sessions_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='AI conversation sessions';

-- ============================================================
-- 20. ai_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_messages (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    session_id BIGINT       NOT NULL,
    role       VARCHAR(20)  NOT NULL,
    content    TEXT                  DEFAULT NULL,
    msg_type   VARCHAR(30)           DEFAULT 'TEXT',
    metadata   JSON                  DEFAULT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME              DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_ai_messages_session (session_id),
    CONSTRAINT fk_ai_messages_session FOREIGN KEY (session_id) REFERENCES ai_sessions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Individual messages within AI sessions';

-- ============================================================
-- 21. recommendations
-- ============================================================
CREATE TABLE IF NOT EXISTS recommendations (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       NOT NULL,
    song_id    BIGINT       NOT NULL,
    score      DOUBLE       NOT NULL,
    reason     VARCHAR(500)          DEFAULT NULL,
    algorithm  VARCHAR(20)  NOT NULL,
    is_clicked TINYINT(1)            DEFAULT 0,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME              DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_recommendations_user (user_id),
    INDEX idx_recommendations_song (song_id),
    INDEX idx_recommendations_algorithm (algorithm),
    CONSTRAINT fk_recommendations_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_recommendations_song FOREIGN KEY (song_id) REFERENCES songs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Song recommendations for users';

-- ============================================================
-- 22. rankings
-- ============================================================
CREATE TABLE IF NOT EXISTS rankings (
    id            BIGINT      NOT NULL AUTO_INCREMENT,
    type          VARCHAR(20) NOT NULL,
    period        VARCHAR(20) NOT NULL,
    song_id       BIGINT      NOT NULL,
    rank_position INT         NOT NULL,
    score         DOUBLE               DEFAULT NULL,
    genre_id      BIGINT               DEFAULT NULL,
    snapshot_date DATE                 DEFAULT NULL,
    created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    DATETIME             DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_rankings_type_period (type, period),
    INDEX idx_rankings_song (song_id),
    INDEX idx_rankings_genre (genre_id),
    INDEX idx_rankings_snapshot (snapshot_date),
    CONSTRAINT fk_rankings_song  FOREIGN KEY (song_id)  REFERENCES songs(id),
    CONSTRAINT fk_rankings_genre FOREIGN KEY (genre_id) REFERENCES genres(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Music rankings / charts';

-- ============================================================
-- Initial Data: Default Genres
-- ============================================================
INSERT INTO genres (name, description, sort_order, created_at, updated_at) VALUES
    ('Pop',       'Popular music with catchy melodies and mainstream appeal',         1,  NOW(), NOW()),
    ('Rock',      'Guitar-driven music with strong rhythms and energy',               2,  NOW(), NOW()),
    ('Jazz',      'Improvisational music with complex harmonies and rhythms',         3,  NOW(), NOW()),
    ('Classical', 'Traditional Western art music from the medieval period to present', 4,  NOW(), NOW()),
    ('R&B',       'Rhythm and blues combining jazz, gospel, and blues influences',    5,  NOW(), NOW()),
    ('Hip-Hop',   'Rhythmic music featuring rapping, DJing, and sampling',            6,  NOW(), NOW()),
    ('Electronic', 'Music produced using electronic instruments and technology',       7,  NOW(), NOW()),
    ('Folk',       'Traditional music passed down through oral tradition',             8,  NOW(), NOW()),
    ('Country',    'Music rooted in American folk and Western traditions',             9,  NOW(), NOW()),
    ('Blues',      'Music rooted in African-American history with 12-bar structures', 10, NOW(), NOW());

-- ============================================================
-- Initial Data: Default Admin User
-- Password: admin123  (BCrypt hash)
-- ============================================================
INSERT INTO users (username, email, password_hash, nickname, role, status, created_at, updated_at) VALUES
    ('admin', 'admin@aitovoice.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrator', 'ADMIN', 'ACTIVE', NOW(), NOW());

-- Create default settings for admin user
INSERT INTO user_settings (user_id, created_at, updated_at)
    SELECT id, NOW(), NOW() FROM users WHERE username = 'admin';

-- ============================================================
-- Initial Data: Sample Voice Exercises
-- ============================================================

-- BREATH exercises
INSERT INTO voice_exercises (title, description, type, difficulty, instructions, target_metrics, duration_sec, sort_order, created_at, updated_at) VALUES
    ('Diaphragmatic Breathing', 'Learn to breathe from your diaphragm for better breath control and vocal support.', 'BREATH', 1,
     'Place one hand on your chest and one on your abdomen. Inhale deeply through your nose for 4 seconds, feeling your abdomen expand. Hold for 2 seconds, then exhale slowly through your mouth for 6 seconds. Your chest should remain relatively still. Repeat 10 times.',
     '{"breath_duration_target_sec": 6, "chest_movement": "minimal"}',
     300, 1, NOW(), NOW()),

    ('Sustained Note Practice', 'Practice holding a single note for as long as possible with steady airflow.', 'BREATH', 2,
     'Take a deep diaphragmatic breath. Sing a comfortable mid-range note (such as middle C) and hold it as long as possible while maintaining consistent volume and pitch. Time yourself. Rest for 30 seconds between attempts. Try to increase your duration each time.',
     '{"min_duration_sec": 15, "pitch_variance_hz": 5}',
     300, 2, NOW(), NOW()),

    ('Breath Control Phrasing', 'Practice controlling your breath across musical phrases of varying lengths.', 'BREATH', 3,
     'Inhale for 4 counts. Sing a phrase lasting 4 counts, rest 2 counts. Then sing a phrase lasting 8 counts, rest 2 counts. Then try 12 counts. Focus on maintaining even volume throughout each phrase. Gradually increase phrase length as you improve.',
     '{"max_phrase_length_counts": 12, "volume_consistency": "high"}',
     420, 3, NOW(), NOW());

-- PITCH exercises
INSERT INTO voice_exercises (title, description, type, difficulty, instructions, target_metrics, duration_sec, sort_order, created_at, updated_at) VALUES
    ('Scale Singing', 'Practice singing major and minor scales to improve pitch accuracy.', 'PITCH', 1,
     'Start on a comfortable note and sing up a C major scale (Do-Re-Mi-Fa-Sol-La-Ti-Do) slowly. Use a piano or app to check each note. Descend back down. Repeat in different keys. Focus on hitting each note cleanly.',
     '{"notes_per_scale": 8, "accuracy_target_pct": 90}',
     300, 4, NOW(), NOW()),

    ('Interval Recognition', 'Train your ear and voice to recognize and reproduce musical intervals.', 'PITCH', 2,
     'Starting from a root note, practice singing each interval: unison, minor 2nd, major 2nd, minor 3rd, major 3rd, perfect 4th, tritone, perfect 5th, minor 6th, major 6th, minor 7th, major 7th, octave. Use a reference instrument to verify accuracy.',
     '{"intervals_count": 13, "accuracy_target_pct": 85}',
     480, 5, NOW(), NOW()),

    ('Melody Matching', 'Match your pitch to a series of played notes in real-time.', 'PITCH', 3,
     'A sequence of 8-12 notes will be played. Listen to the full sequence first. Then sing it back from memory. Start with simple step-wise melodies and progress to melodies with larger intervals and more complex rhythms.',
     '{"melody_length": 12, "pitch_accuracy_hz": 10}',
     360, 6, NOW(), NOW());

-- RHYTHM exercises
INSERT INTO voice_exercises (title, description, type, difficulty, instructions, target_metrics, duration_sec, sort_order, created_at, updated_at) VALUES
    ('Basic Rhythm Clapping', 'Develop your sense of rhythm by clapping along with a metronome.', 'RHYTHM', 1,
     'Set a metronome to 60 BPM. Clap on each beat for 1 minute. Then try clapping on beats 1 and 3, then 2 and 4. Progress to eighth notes (two claps per beat). Focus on staying perfectly in time with the metronome.',
     '{"bpm": 60, "timing_accuracy_ms": 50}',
     300, 7, NOW(), NOW()),

    ('Syncopation Practice', 'Practice singing syncopated rhythms to develop a stronger rhythmic feel.', 'RHYTHM', 2,
     'Set a metronome to 80 BPM. Sing "ta" on the off-beats (the "and" between beats). Start with simple patterns: "rest-ta-rest-ta" then progress to "ta-rest-ta-ta". Practice common syncopated patterns found in pop and jazz music.',
     '{"bpm": 80, "patterns_count": 5}',
     360, 8, NOW(), NOW());

-- VIBRATO exercises
INSERT INTO voice_exercises (title, description, type, difficulty, instructions, target_metrics, duration_sec, sort_order, created_at, updated_at) VALUES
    ('Diaphragmatic Vibrato', 'Learn to produce a natural vibrato using controlled diaphragm pulses.', 'VIBRATO', 2,
     'Sing a comfortable sustained note. While holding the note, gently pulse your diaphragm to create a slight wavering in pitch. Start slowly (about 3-4 pulses per second) and gradually increase to 5-6 per second. The vibrato should feel natural, not forced.',
     '{"vibrato_rate_hz": 5, "vibrato_width_cents": 50}',
     360, 9, NOW(), NOW()),

    ('Controlled Vibrato Release', 'Practice turning vibrato on and off smoothly for expressive singing.', 'VIBRATO', 3,
     'Sing a sustained note with straight tone for 4 beats, then add vibrato for 4 beats, then return to straight tone for 4 beats. Practice transitioning smoothly between straight and vibrato tones. Vary the speed and width of your vibrato for different expressive effects.',
     '{"transition_smoothness": "high", "vibrato_rate_range_hz": [4, 7]}',
     420, 10, NOW(), NOW());

-- ============================================================
-- End of initialization script
-- ============================================================
