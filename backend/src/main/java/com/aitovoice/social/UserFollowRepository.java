package com.aitovoice.social;

import com.aitovoice.social.entity.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {
    Optional<UserFollow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    long countByFollowingIdAndDeletedAtIsNull(Long userId);
    long countByFollowerIdAndDeletedAtIsNull(Long userId);
}
