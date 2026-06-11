package com.aitovoice.music;

import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.entity.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(source = "artist.name", target = "artistName")
    @Mapping(source = "album.title", target = "albumName")
    @Mapping(source = "genre.name", target = "genreName")
    SongDto toDto(Song song);
}
