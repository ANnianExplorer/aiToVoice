package com.aitovoice.social.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.social.entity.UserFollow;
import com.aitovoice.social.repository.UserFollowRepository;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final UserFollowRepository followRepository;

    @Transactional
    public void follow(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new BusinessException(ErrorCode.CANNOT_FOLLOW_SELF);
        }
        var existing = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (existing.isPresent() && existing.get().getDeletedAt() == null) {
            throw new BusinessException(ErrorCode.ALREADY_FOLLOWING);
        }
        if (existing.isPresent()) {
            existing.get().setDeletedAt(null);
            followRepository.save(existing.get());
        } else {
            followRepository.save(UserFollow.builder()
                    .follower(User.builder().id(followerId).build())
                    .following(User.builder().id(followingId).build())
                    .build());
        }
    }

    @Transactional
    public void unfollow(Long followerId, Long followingId) {
        followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .ifPresent(f -> {
                    f.softDelete();
                    followRepository.save(f);
                });
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getFollowStats(Long userId) {
        return Map.of(
                "followers", followRepository.countByFollowingIdAndDeletedAtIsNull(userId),
                "following", followRepository.countByFollowerIdAndDeletedAtIsNull(userId)
        );
    }
}
