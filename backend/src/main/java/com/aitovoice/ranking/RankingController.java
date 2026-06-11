package com.aitovoice.ranking;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.ranking.dto.RankingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/hot")
    public ApiResponse<List<RankingDto>> hot() {
        return ApiResponse.success(rankingService.getHot());
    }

    @GetMapping("/new")
    public ApiResponse<List<RankingDto>> newSongs() {
        return ApiResponse.success(rankingService.getNew());
    }

    @GetMapping("/rising")
    public ApiResponse<List<RankingDto>> rising() {
        return ApiResponse.success(rankingService.getRising());
    }

    @GetMapping("/genre/{genreId}")
    public ApiResponse<List<RankingDto>> byGenre(@PathVariable Long genreId) {
        return ApiResponse.success(rankingService.getByGenre(genreId));
    }
}
