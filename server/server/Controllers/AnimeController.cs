using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Anime;
using server.Mappers;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimeController : ControllerBase
    {
        private readonly IAnimeService _animeService;

        public AnimeController(IAnimeService animeService)
        {
            _animeService = animeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var results = await _animeService.GetAll();
            var model = results.Select(record => AnimeMapper.ToAnimeDto(record, null)).ToList();
            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CreateAnimeDto animeDto)
        {
            if (animeDto == null)
                return BadRequest();
            var imageId = null as string;
            if (animeDto.Image != null)
            {
                imageId = Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(imageId, animeDto.Image);
            }
            var anime = AnimeMapper.ToAnimeFromCreate(animeDto, imageId);

            await _animeService.AddAnime(anime);
            return Created();
        }
    }
}
