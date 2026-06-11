package com.aitovoice.music.entity;

import java.io.Serializable;
import java.util.Objects;

public class SongTagId implements Serializable {
    private Long songId;
    private Long tagId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SongTagId that)) return false;
        return Objects.equals(songId, that.songId) && Objects.equals(tagId, that.tagId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(songId, tagId);
    }
}
