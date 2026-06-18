package com.aitovoice.config;

import com.aitovoice.music.entity.Artist;
import com.aitovoice.music.entity.Genre;
import com.aitovoice.music.entity.Song;
import com.aitovoice.music.repository.ArtistRepository;
import com.aitovoice.music.repository.GenreRepository;
import com.aitovoice.music.repository.SongRepository;
import com.aitovoice.voice.entity.VoiceExercise;
import com.aitovoice.voice.repository.VoiceExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Order(0)
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final GenreRepository genreRepository;
    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;
    private final VoiceExerciseRepository exerciseRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // Check if data already exists to avoid re-seeding
        var existingGenres = genreRepository.findAll();
        if (!existingGenres.isEmpty() && songRepository.count() > 0) {
            log.info("Database already has data, skipping seed");
            return;
        }

        log.info("Seeding demo data...");

        // Genres — use existing if present
        var genres = existingGenres;
        if (genres.isEmpty()) {
            genres = genreRepository.saveAll(List.of(
                    genre("Pop", "流行音乐", 1),
                    genre("Rock", "摇滚音乐", 2),
                    genre("Jazz", "爵士音乐", 3),
                    genre("Classical", "古典音乐", 4),
                    genre("R&B", "节奏布鲁斯", 5),
                    genre("Hip-Hop", "嘻哈音乐", 6),
                    genre("Electronic", "电子音乐", 7),
                    genre("Folk", "民谣", 8)
            ));
        }

        // Artists
        var artists = artistRepository.saveAll(List.of(
                artist("周杰伦", "华语流行天王"),
                artist("林俊杰", "新加坡创作歌手"),
                artist("陈奕迅", "香港实力派歌手"),
                artist("邓紫棋", "华语创作女歌手"),
                artist("薛之谦", "内地创作歌手"),
                artist("Taylor Swift", "Global pop superstar"),
                artist("Ed Sheeran", "British singer-songwriter"),
                artist("Adele", "British soul and pop vocalist")
        ));

        // Songs — find genres by name for safety
        var pop = genres.stream().filter(g -> g.getName().equals("Pop")).findFirst().orElse(genres.get(0));
        var rock = genres.stream().filter(g -> g.getName().equals("Rock")).findFirst().orElse(genres.get(0));
        var rnb = genres.stream().filter(g -> g.getName().equals("R&B")).findFirst().orElse(genres.get(0));
        var folk = genres.stream().filter(g -> g.getName().equals("Folk")).findFirst().orElse(genres.get(0));

        songRepository.saveAll(List.of(
                song("晴天", artists.get(0), pop, 269),
                song("稻香", artists.get(0), pop, 223),
                song("七里香", artists.get(0), pop, 299),
                song("夜曲", artists.get(0), pop, 235),
                song("告白气球", artists.get(0), pop, 215),
                song("修炼爱情", artists.get(1), pop, 290),
                song("她说", artists.get(1), pop, 262),
                song("江南", artists.get(1), pop, 280),
                song("不为谁而作的歌", artists.get(1), pop, 252),
                song("十年", artists.get(2), pop, 208),
                song("富士山下", artists.get(2), pop, 284),
                song("孤勇者", artists.get(2), rock, 262),
                song("红玫瑰", artists.get(2), pop, 264),
                song("泡沫", artists.get(3), pop, 270),
                song("光年之外", artists.get(3), pop, 235),
                song("倒数", artists.get(3), pop, 229),
                song("演员", artists.get(4), pop, 270),
                song("绅士", artists.get(4), pop, 258),
                song("认真的雪", artists.get(4), folk, 264),
                song("Shape of You", artists.get(6), pop, 234),
                song("Perfect", artists.get(6), pop, 263),
                song("Thinking Out Loud", artists.get(6), rnb, 281),
                song("Anti-Hero", artists.get(5), pop, 200),
                song("Blank Space", artists.get(5), pop, 231),
                song("Love Story", artists.get(5), pop, 235),
                song("Rolling in the Deep", artists.get(7), rock, 228),
                song("Someone Like You", artists.get(7), pop, 285),
                song("Hello", artists.get(7), pop, 295),
                song("夜空中最亮的星", artists.get(4), rock, 252),
                song("平凡之路", artists.get(4), folk, 290)
        ));

        // Voice Exercises
        if (exerciseRepository.count() == 0) {
            exerciseRepository.saveAll(List.of(
                    exercise("音阶练习", "基础音阶上下行练习，从低音到高音再回来", VoiceExercise.ExerciseType.PITCH, 1, 1),
                    exercise("长音保持", "每个音保持10秒以上，训练气息控制", VoiceExercise.ExerciseType.BREATH, 2, 2),
                    exercise("音准测试", "跟着示例音高演唱，测试音准能力", VoiceExercise.ExerciseType.PITCH, 3, 3),
                    exercise("节奏感训练", "跟拍子演唱，训练节奏感", VoiceExercise.ExerciseType.RHYTHM, 2, 4),
                    exercise("颤音练习", "练习声音颤音技巧", VoiceExercise.ExerciseType.VIBRATO, 3, 5),
                    exercise("气息控制", "腹式呼吸练习，提升气息稳定性", VoiceExercise.ExerciseType.BREATH, 1, 6)
            ));
            log.info("Seeded 6 voice exercises");
        }

        log.info("Seeded 8 genres, 8 artists, 30 songs");
    }

    private Genre genre(String name, String desc, int order) {
        var g = new Genre();
        g.setName(name);
        g.setDescription(desc);
        g.setSortOrder(order);
        return g;
    }

    private Artist artist(String name, String bio) {
        var a = new Artist();
        a.setName(name);
        a.setBio(bio);
        a.setSourceType(Artist.SourceType.LOCAL);
        return a;
    }

    private VoiceExercise exercise(String title, String desc, VoiceExercise.ExerciseType type, int difficulty, int order) {
        var e = new VoiceExercise();
        e.setTitle(title);
        e.setDescription(desc);
        e.setType(type);
        e.setDifficulty(difficulty);
        e.setSortOrder(order);
        return e;
    }

    private Song song(String title, Artist artist, Genre genre, int duration) {
        var s = new Song();
        s.setTitle(title);
        s.setArtist(artist);
        s.setGenre(genre);
        s.setDuration(duration);
        s.setSourceType(Song.SourceType.LOCAL);
        s.setPlayCount((long) (Math.random() * 10000));
        s.setLikeCount((long) (Math.random() * 1000));
        return s;
    }
}
