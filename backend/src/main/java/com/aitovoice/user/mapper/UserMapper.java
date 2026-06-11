package com.aitovoice.user.mapper;

import com.aitovoice.user.dto.UserProfileDto;
import com.aitovoice.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserProfileDto toProfileDto(User user);
}
