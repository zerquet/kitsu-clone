using Microsoft.AspNetCore.Mvc;
using server.Dtos.Anime;
using server.Mappers;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimeController : ControllerBase
    {
        private readonly IAnimeService _animeService;
        private readonly ICategoryService _categoryService;

        public AnimeController(
            IAnimeService animeService, 
            ICategoryService categoryService
            )
        {
            _animeService = animeService;
            _categoryService = categoryService;
        }

        [HttpGet("{animeId}")]
        public async Task<IActionResult> Get(int animeId) {
            var anime = await _animeService.Get(animeId);
            if (anime == null) return NotFound();
            var dto = anime.ToAnimeDto();
            return Ok(dto);
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var animes = await _animeService.GetAll();
            var animesDto = animes
                .Select(a => a.ToAnimeDto())
                .ToList();
            return Ok(animesDto);
        }

        [HttpGet("GetByCategory/{category}")]
        public async Task<IActionResult> GetByCategory([FromRoute] string category)
        {
            var categoryMatch = await _categoryService.GetCategoryByName(category);
            if (categoryMatch == null) return NotFound();
            var animes = await _animeService.GetByCategoryId(categoryMatch.Id);
            var animesDto = animes
                .Select(a => a.ToAnimeDto())
                .ToList();
            return Ok(animesDto);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CreateAnimeDto request)
        {
            if (request == null)
                return BadRequest();
            var imageId = null as string;
            var coverImageId = null as string;
            if (request.Image != null)
            {
                imageId = Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(imageId, request.Image);
            }
            if (request.CoverImage != null)
            {
                coverImageId = Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(coverImageId, request.CoverImage);
            }
            var anime = request.ToAnimeFromCreate(imageId, coverImageId);
            await _animeService.AddAnime(anime);
            await _animeService.AddCategories(request.Categories, anime.Id);
            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromForm] UpdateAnimeDto request)
        {
            if (request == null) return BadRequest();
            var animeMatch = await _animeService.Get(request.Id);
            if (animeMatch == null) return BadRequest("Anime not found");
            var imageId = null as string;
            var coverImageId = null as string;
            if(request.Image != null)
            {
                imageId = Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(imageId, request.Image); //delete previous photo?
            }
            if(request.CoverImage != null)
            {
                coverImageId= Guid.NewGuid().ToString();
                FileServerService.PostAnimeImage(coverImageId, request.CoverImage); //delete previous cover too?
            }
            request.ToAnimeFromUpdate(animeMatch, imageId, coverImageId);
            await _animeService.UpdateAnime(animeMatch);
            await _animeService.UpdateCategories(animeMatch, request.Categories);
            return Ok();
        }

        [HttpGet("MiniSearch")]
        public async Task<IActionResult> MiniSearch([FromQuery] string term)
        {
            if (string.IsNullOrEmpty(term)) return Ok(new List<AnimeDto>());
            var animes = await _animeService.MiniSearch(term);
            var animesDto = animes.Select(a => new AnimeDto
            {
                Id = a.Id,
                Title = a.Title,
                ImageBase64 = "/assets/images/" + a.ImageUrl + ".jpg"
            }).ToList();

            return Ok(animesDto);
        }

        [HttpGet("AdvancedSearch")]
        public async Task<List<AnimeDto>> AdvancedSearch(
            [FromQuery] string? term, 
            [FromQuery] int? minYear, 
            [FromQuery] int? maxYear, 
            [FromQuery] int? minEpisodes, 
            [FromQuery] int? maxEpisodes, 
            [FromQuery] int? minRating, 
            [FromQuery] int? maxRating, 
            [FromQuery] string? mediaType
            )
        {
            var mediaTypes = mediaType?.Split(',');
            var animes = await _animeService
                .AdvancedSearch(term, minYear, maxYear, minEpisodes, maxEpisodes, minRating, maxRating, mediaTypes);
            var animesDto = animes.Select(a => new AnimeDto
            {
                Id = a.Id,
                Title = a.Title,
                ImageBase64 = "/assets/images/" + a.ImageUrl + ".jpg",
                Year = a.Year,
                Score = a.Score,
                Description = a.Description
            }).ToList();

            return animesDto;
        }

        [HttpGet("GetByFranchise/{franchiseId}")]
        public async Task<IActionResult> GetByFranchise([FromRoute] int franchiseId)
        {
            var animes = await _animeService.GetByFranchise(franchiseId);
            var animesDto = animes
                .Select(a => a.ToAnimeDto())
                .ToList();
            return Ok(animesDto);
        }
    }
}
