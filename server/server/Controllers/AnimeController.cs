using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Anime;
using server.Mappers;
using server.Models;
using server.Services;
using static System.Net.Mime.MediaTypeNames;

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
            var model = AnimeMapper.ToAnimeDto(result, 
                FileServerService.GetAnimeImage(result.ImageUrl!), FileServerService.GetAnimeImage(result.CoverImageId!));
            return Ok(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var results = await _animeService.GetAll();
            var model = results
                .Select(record => AnimeMapper.ToAnimeDto(record, FileServerService.GetAnimeImage(record.ImageUrl!), FileServerService.GetAnimeImage(record.CoverImageId!)))
                .ToList();
            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CreateAnimeDto animeDto)
        {
            if (animeDto == null)
                return BadRequest();
            var imageId = null as string;
            var coverImageId = null as string;
            if (animeDto.Image != null)
            {
                imageId = Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(imageId, animeDto.Image);
            }
            if (animeDto.CoverImage != null)
            {
                coverImageId = Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(coverImageId, animeDto.CoverImage);
            }
            var anime = AnimeMapper.ToAnimeFromCreate(animeDto, imageId, coverImageId);

            await _animeService.AddAnime(anime);
            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromForm] UpdateAnimeDto animeDto)
        {
            if (animeDto == null) return BadRequest();
            var animeMatch = await _animeService.Get(animeDto.Id);
            if (animeMatch == null) return BadRequest("Anime not found");
            var imageId = null as string;
            var coverImageId = null as string;
            if(animeDto.Image != null)
            {
                imageId = Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(imageId, animeDto.Image); //delete previous photo?
            }
            if(animeDto.CoverImage != null)
            {
                coverImageId= Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(coverImageId, animeDto.CoverImage); //delete previous cover too?
            }
            AnimeMapper.ToAnimeFromUpdate(animeDto, animeMatch, imageId, coverImageId);
            _animeService.UpdateAnime(animeMatch);
            return Ok();
        }

        [HttpGet("search")]
        public async Task<List<AnimeDto>> MiniSearch(string term)
        {
            if (string.IsNullOrEmpty(term)) return [];
            var results = await _animeService.MiniSearch(term);
            var final = results.Select(a => new AnimeDto
            {
                Id = a.Id,
                Title = a.Title,
                ImageBase64 = FileServerService.GetAnimeImage(a.ImageUrl)
            }).ToList();

            return final;
        }

        [HttpGet("advancedSearch")]
        public async Task<List<AnimeDto>> AdvancedSearch(
            string? term, int? minYear,  int? maxYear, int? minEpisodes, int? maxEpisodes, int? minRating, int? maxRating, string? mediaType)
        {
            var mediaTypes = mediaType?.Split(',');
            var results = await _animeService.AdvancedSearch(term, minYear, maxYear, minEpisodes, maxEpisodes, minRating, maxRating, mediaTypes);
            var final = results.Select(a => new AnimeDto
            {
                Id = a.Id,
                Title = a.Title,
                ImageBase64 = FileServerService.GetAnimeImage(a.ImageUrl)
            }).ToList();

            return final;
        }
    }
}
