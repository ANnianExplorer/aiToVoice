package com.aitovoice.music.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.music.mapper.SongMapper;
import com.aitovoice.music.repository.SongRepository;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.dto.CreatePlaylistRequest;
import com.aitovoice.music.dto.PlaylistDto;
import com.aitovoice.music.entity.Playlist;
import com.aitovoice.music.entity.PlaylistSong;
import com.aitovoice.music.repository.PlaylistRepository;
import com.aitovoice.music.repository.PlaylistSongRepository;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongRepository songRepository;
    private final SongMapper songMapper;

    @Transactional
    public PlaylistDto create(Long userId, CreatePlaylistRequest request) {
        var playlist = Playlist.builder()
                .user(User.builder().id(userId).build())
                .name(request.name())
                .description(request.description())
                .isPublic(request.isPublic() != null ? request.isPublic() : true)
                .build();
        playlistRepository.save(playlist);
        return toDto(playlist);
    }

    @Transactional(readOnly = true)
    public PlaylistDto getById(Long id, Long userId) {
        var playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        if (!playlist.getIsPublic() && !playlist.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        return toDto(playlist);
    }

    @Transactional(readOnly = true)
    public PlaylistDto getPublicById(Long id) {
        var playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        if (!playlist.getIsPublic()) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        return toDto(playlist);
    }

    @Transactional(readOnly = true)
    public List<PlaylistDto> getMyPlaylists(Long userId) {
        return playlistRepository.findByUserIdAndDeletedAtIsNull(userId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public void addSong(Long playlistId, Long songId, Long userId) {
        var playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        if (!playlist.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        if (playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songId).isPresent()) {
            throw new BusinessException(ErrorCode.SONG_ALREADY_IN_PLAYLIST);
        }
        var song = songRepository.findById(songId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SONG_NOT_FOUND));
        var count = playlistSongRepository.findByPlaylistIdOrderBySortOrder(playlistId).size();
        var ps = PlaylistSong.builder()
                .playlist(playlist)
                .song(song)
                .sortOrder(count + 1)
                .build();
        playlistSongRepository.save(ps);
        playlist.setSongCount(count + 1);
        playlistRepository.save(playlist);
    }

    @Transactional
    public void removeSong(Long playlistId, Long songId, Long userId) {
        var playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        if (!playlist.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        playlistSongRepository.deleteByPlaylistIdAndSongId(playlistId, songId);
        playlist.setSongCount(Math.max(0, playlist.getSongCount() - 1));
        playlistRepository.save(playlist);
    }

    @Transactional(readOnly = true)
    public List<SongDto> getPlaylistSongs(Long playlistId) {
        return playlistSongRepository.findByPlaylistIdOrderBySortOrder(playlistId).stream()
                .map(ps -> songMapper.toDto(ps.getSong()))
                .toList();
    }

    @Transactional
    public void delete(Long id, Long userId) {
        var playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLAYLIST_NOT_FOUND));
        if (!playlist.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }
        playlist.softDelete();
        playlistRepository.save(playlist);
    }

    private PlaylistDto toDto(Playlist p) {
        return new PlaylistDto(
                p.getId(), p.getUser().getId(), p.getName(), p.getDescription(),
                p.getCoverUrl(), p.getIsPublic(), p.getPlayCount(), p.getSongCount(),
                p.getCreatedAt());
    }
}
