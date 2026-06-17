package com.aitovoice.music.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.entity.Song;
import com.aitovoice.music.entity.UserSong;
import com.aitovoice.music.mapper.SongMapper;
import com.aitovoice.music.repository.SongRepository;
import com.aitovoice.music.repository.UserSongRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SongServiceTest {

    @Mock
    private SongRepository songRepository;
    @Mock
    private UserSongRepository userSongRepository;
    @Mock
    private FileStorageService fileStorage;
    @Mock
    private SongMapper songMapper;

    @InjectMocks
    private SongService songService;

    private Song testSong;
    private SongDto testSongDto;

    @BeforeEach
    void setUp() {
        testSong = Song.builder()
                .title("Test Song")
                .duration(180)
                .sourceType(Song.SourceType.LOCAL)
                .playCount(0L)
                .likeCount(0L)
                .build();
        testSong.setId(1L);

        testSongDto = new SongDto(1L, "Test Song", "Artist", "Album", "Pop", 180, null, "LOCAL", 0L, 0L);
    }

    @Test
    void getSong_success() {
        when(songRepository.findById(1L)).thenReturn(Optional.of(testSong));
        when(songMapper.toDto(testSong)).thenReturn(testSongDto);

        var result = songService.getSong(1L);

        assertNotNull(result);
        assertEquals("Test Song", result.title());
    }

    @Test
    void getSong_notFound_throwsException() {
        when(songRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(BusinessException.class, () -> songService.getSong(999L));
    }

    @Test
    void getHotSongs_returnsList() {
        when(songRepository.findHotSongs(any(PageRequest.class))).thenReturn(List.of(testSong));
        when(songMapper.toDto(testSong)).thenReturn(testSongDto);

        var result = songService.getHotSongs(10);

        assertEquals(1, result.size());
        assertEquals("Test Song", result.get(0).title());
    }

    @Test
    void recordPlay_incrementsCount() {
        when(songRepository.existsById(1L)).thenReturn(true);
        when(userSongRepository.findByUserIdAndSongIdAndType(1L, 1L, UserSong.UserSongType.HISTORY))
                .thenReturn(Optional.empty());
        when(songRepository.incrementPlayCount(1L)).thenReturn(1);
        when(userSongRepository.save(any())).thenReturn(null);

        songService.recordPlay(1L, 1L);

        verify(songRepository).incrementPlayCount(1L);
        verify(userSongRepository).save(any(UserSong.class));
    }
}
