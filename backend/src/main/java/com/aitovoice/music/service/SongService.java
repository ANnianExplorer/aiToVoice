package com.aitovoice.music.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.Constants;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.dto.SongSearchRequest;
import com.aitovoice.music.entity.Song;
import com.aitovoice.music.entity.UserSong;
import com.aitovoice.music.mapper.SongMapper;
import com.aitovoice.music.repository.SongRepository;
import com.aitovoice.music.repository.UserSongRepository;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final UserSongRepository userSongRepository;
    private final FileStorageService fileStorage;
    private final SongMapper songMapper;
    private final AudioDurationExtractor durationExtractor;

    @Transactional
    public SongDto upload(MultipartFile file, String title, Long artistId, Long genreId) {
        var filePath = fileStorage.store(file, "audio", Constants.ALLOWED_AUDIO_EXTENSIONS);

        // 提取音频时长
        var audioFile = fileStorage.getFilePath(filePath).toFile();
        var duration = durationExtractor.extract(audioFile);

        var song = Song.builder()
                .title(title)
                .filePath(filePath)
                .sourceType(Song.SourceType.LOCAL)
                .duration(duration)
                .artist(artistId != null ? com.aitovoice.music.entity.Artist.builder().id(artistId).build() : null)
                .genre(genreId != null ? com.aitovoice.music.entity.Genre.builder().id(genreId).build() : null)
                .build();
        songRepository.save(song);
        return songMapper.toDto(song);
    }

    @Transactional(readOnly = true)
    public Page<SongDto> search(SongSearchRequest request) {
        var pageable = PageRequest.of(request.page(), request.size());
        var keyword = request.keyword();
        if (keyword == null || keyword.isBlank()) {
            return Page.empty(pageable);
        }
        var escaped = keyword.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
        Page<Song> songs;
        if (request.genreId() != null) {
            songs = songRepository.searchByTitleAndGenre(escaped, request.genreId(), pageable);
        } else {
            songs = songRepository.searchByTitle(escaped, pageable);
        }
        return songs.map(songMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<SongDto> getHotSongs(int limit) {
        return songRepository.findHotSongs(PageRequest.of(0, limit)).stream()
                .map(songMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SongDto> getNewSongs(int limit) {
        return songRepository.findNewSongs(PageRequest.of(0, limit)).stream()
                .map(songMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public SongDto getSong(Long id) {
        var song = songRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SONG_NOT_FOUND));
        return songMapper.toDto(song);
    }

    @Transactional
    public void recordPlay(Long userId, Long songId) {
        if (!songRepository.existsById(songId)) {
            throw new BusinessException(ErrorCode.SONG_NOT_FOUND);
        }
        songRepository.incrementPlayCount(songId);

        var existing = userSongRepository.findByUserIdAndSongIdAndType(
                userId, songId, UserSong.UserSongType.HISTORY);
        if (existing.isPresent()) {
            userSongRepository.incrementPlayCount(userId, songId, UserSong.UserSongType.HISTORY);
        } else {
            var history = UserSong.builder()
                    .user(User.builder().id(userId).build())
                    .song(Song.builder().id(songId).build())
                    .type(UserSong.UserSongType.HISTORY)
                    .playCount(1)
                    .lastPlayedAt(java.time.LocalDateTime.now())
                    .build();
            userSongRepository.save(history);
        }
    }

    @Transactional
    public void toggleFavorite(Long userId, Long songId) {
        var existing = userSongRepository.findByUserIdAndSongIdAndType(
                userId, songId, UserSong.UserSongType.FAVORITE);
        if (existing.isPresent()) {
            existing.get().softDelete();
            userSongRepository.save(existing.get());
            songRepository.decrementLikeCount(songId);
        } else {
            var fav = UserSong.builder()
                    .user(User.builder().id(userId).build())
                    .song(Song.builder().id(songId).build())
                    .type(UserSong.UserSongType.FAVORITE)
                    .build();
            userSongRepository.save(fav);
            songRepository.incrementLikeCount(songId);
        }
    }

    @Transactional(readOnly = true)
    public List<SongDto> getFavorites(Long userId) {
        return userSongRepository.findByUserIdAndType(
                        userId, UserSong.UserSongType.FAVORITE, PageRequest.of(0, 500))
                .getContent().stream()
                .map(us -> songMapper.toDto(us.getSong()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SongDto> getHistory(Long userId) {
        return userSongRepository.findByUserIdAndType(
                        userId, UserSong.UserSongType.HISTORY, PageRequest.of(0, 100))
                .getContent().stream()
                .map(us -> songMapper.toDto(us.getSong()))
                .toList();
    }
}
