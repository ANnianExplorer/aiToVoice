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

    @Transactional
    public SongDto upload(MultipartFile file, String title, Long artistId, Long genreId) {
        var filePath = fileStorage.store(file, "audio", Constants.ALLOWED_AUDIO_EXTENSIONS);
        var song = Song.builder()
                .title(title)
                .filePath(filePath)
                .sourceType(Song.SourceType.LOCAL)
                .duration(0)
                .build();
        songRepository.save(song);
        return songMapper.toDto(song);
    }

    public Page<SongDto> search(SongSearchRequest request) {
        var pageable = PageRequest.of(request.page(), request.size());
        var songs = songRepository.searchByTitle(request.keyword(), pageable);
        return songs.map(songMapper::toDto);
    }

    public List<SongDto> getHotSongs(int limit) {
        return songRepository.findHotSongs(PageRequest.of(0, limit)).stream()
                .map(songMapper::toDto)
                .toList();
    }

    public List<SongDto> getNewSongs(int limit) {
        return songRepository.findNewSongs(PageRequest.of(0, limit)).stream()
                .map(songMapper::toDto)
                .toList();
    }

    public SongDto getSong(Long id) {
        var song = songRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SONG_NOT_FOUND));
        return songMapper.toDto(song);
    }

    @Transactional
    public void recordPlay(Long userId, Long songId) {
        var song = songRepository.findById(songId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SONG_NOT_FOUND));
        song.setPlayCount(song.getPlayCount() + 1);
        songRepository.save(song);

        var history = userSongRepository.findByUserIdAndSongIdAndType(
                userId, songId, UserSong.UserSongType.HISTORY)
                .orElseGet(() -> UserSong.builder()
                        .user(User.builder().id(userId).build())
                        .song(song)
                        .type(UserSong.UserSongType.HISTORY)
                        .build());
        history.setPlayCount(history.getPlayCount() + 1);
        history.setLastPlayedAt(java.time.LocalDateTime.now());
        userSongRepository.save(history);
    }

    @Transactional
    public void toggleFavorite(Long userId, Long songId) {
        var existing = userSongRepository.findByUserIdAndSongIdAndType(
                userId, songId, UserSong.UserSongType.FAVORITE);
        if (existing.isPresent()) {
            existing.get().softDelete();
            userSongRepository.save(existing.get());
        } else {
            var fav = UserSong.builder()
                    .user(User.builder().id(userId).build())
                    .song(Song.builder().id(songId).build())
                    .type(UserSong.UserSongType.FAVORITE)
                    .build();
            userSongRepository.save(fav);
        }
    }

    public List<SongDto> getFavorites(Long userId) {
        return userSongRepository.findByUserIdAndType(
                        userId, UserSong.UserSongType.FAVORITE, PageRequest.of(0, 500))
                .getContent().stream()
                .map(us -> songMapper.toDto(us.getSong()))
                .toList();
    }

    public List<SongDto> getHistory(Long userId) {
        return userSongRepository.findByUserIdAndType(
                        userId, UserSong.UserSongType.HISTORY, PageRequest.of(0, 100))
                .getContent().stream()
                .map(us -> songMapper.toDto(us.getSong()))
                .toList();
    }
}
