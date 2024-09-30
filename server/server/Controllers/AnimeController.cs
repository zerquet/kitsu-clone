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

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id) {
            var result = await _animeService.Get(id);
            if (result == null)
            {
                return NotFound();
            }
            var model = AnimeMapper.ToAnimeDto(result, FileServerService.GetAnimeImage(result.ImageUrl!));
            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var results = await _animeService.GetAll();
            var model = results.Select(record => AnimeMapper.ToAnimeDto(record, FileServerService.GetAnimeImage(record.ImageUrl!))).ToList();
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
