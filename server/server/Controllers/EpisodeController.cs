using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Episode;
using server.Mappers;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EpisodeController : ControllerBase
    {
        private readonly IEpisodeService _episodeService;
        private readonly IAnimeService _animeService;
        public EpisodeController(IEpisodeService episodeService, IAnimeService animeService)
        {
            _episodeService = episodeService;
            _animeService = animeService;
        }

        [HttpGet("{animeId}")]
        public async Task<IActionResult> GetByAnime([FromRoute] int animeId)
        {
            // Checking if anime exists should be its own method instead of returning the entire record.
            if (await _animeService.Get(animeId) == null) return NotFound("Anime not found!");
            return Ok(await _episodeService.GetEpisodesByAnime(animeId)); // This should be a DTO
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] EpisodeDto request) // This should be a create DTO
        {
            var animeMatch = await _animeService.Get(request.AnimeId);
            if (animeMatch == null) return NotFound("Anime not found!");
            var episode = request.ToEpisodeFromCreate();
            await _episodeService.AddEpisode(episode);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _episodeService.GetAll());
        }
    }
}
