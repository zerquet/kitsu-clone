using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Anime;
using server.Dtos.LibraryEntry;
using server.Mappers;
using server.Models;
using server.Models.Identity;
using server.Services;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibraryEntryController : ControllerBase
    {
        private readonly IAnimeService _animeService;
        private readonly IAnimeLibraryEntryService _animeLibraryEntryService;
        private readonly UserManager<KitsuUser> _userManager;
        public LibraryEntryController(
            IAnimeService animeService, 
            UserManager<KitsuUser> userManager, 
            IAnimeLibraryEntryService animeLibraryEntryService
            )
        {
            _animeService = animeService;
            _userManager = userManager;
            _animeLibraryEntryService = animeLibraryEntryService;
        }

        [HttpGet("GetAllByUser/{userId}")]
        public async Task<IActionResult> GetAllByUser(string userId)
        {
            var libraryEntries = await _animeLibraryEntryService.GetLibrary(userId);
            var libraryEntriesWithAnimeInfoDto = new List<LibraryEntryWithAnimeInfoDto>();

            foreach (var l in libraryEntries)
            {
                var anime = await _animeService.Get(l.AnimeId);
                libraryEntriesWithAnimeInfoDto.Add(l.ToLibraryEntryWithAnimeInfoDto(anime));
            }

            return Ok(libraryEntriesWithAnimeInfoDto);
        }

        [Authorize]
        [HttpGet("{animeId}")]
        public async Task<IActionResult> Get([FromRoute] int animeId)
        {
            var anime = await _animeService.Get(animeId);
            if (anime == null) return NotFound("Anime not found.");
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var libraryEntry = await _animeLibraryEntryService.GetStatus(appUser.Id, animeId);
            if (libraryEntry == null) return Ok(null);
            return Ok(libraryEntry.ToLibraryEntryDto());
        }

        //SetStatus takes in no rating? I don't remember why I decided on this? Need to think
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateLibraryItemDto request)
        {
            var anime = await _animeService.Get(request.AnimeId);
            if (anime == null) return NotFound();
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var libraryEntry = new LibraryEntry
            {
                AnimeId = request.AnimeId,
                KitsuUserId = appUser.Id,
                WatchStatus = request.WatchStatus,
                EpisodesWatched = request.EpisodesWatched
            };

            try
            {
                await _animeLibraryEntryService.SetStatus(libraryEntry);
                return CreatedAtAction(nameof(Get), new { animeId = libraryEntry.AnimeId }, libraryEntry.ToLibraryEntryDto()); //return Id by calling a get route/action?

                //createdAtAction (pass in ACTION name, so name of the action method itself
                //  like nameOf(GetItem) in Task<List<X>> GetItem(int id) {}
                //createdAtRoute (pass in the ROUTE name, typically the name you entered in [HttpPost('login')], [HttpGet('search')], etc. 
                //  the route names would be 'login', and 'search'. 
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] UpdateLibraryEntryDto request)
        {
            //get library record by id? or by where condition (user and anime ids) and confirm only 1 is returned?
            var libraryEntryMatch = await _animeLibraryEntryService.GetStatusById(request.Id);
            if (libraryEntryMatch == null) return NotFound();
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            if (libraryEntryMatch.KitsuUserId != appUser.Id) return Unauthorized();
            request.ToLibraryEntryFromUpdate(libraryEntryMatch);
            await _animeLibraryEntryService.SaveChanges();
            return Ok(libraryEntryMatch.ToLibraryEntryDto());
        }

        [Authorize]
        [HttpDelete("{animeId}")]
        public async Task<IActionResult> Delete([FromRoute] int animeId)
        {
            var anime = await _animeService.Get(animeId);
            if (anime == null) return NotFound();
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            await _animeLibraryEntryService.DeleteStatus(appUser.Id, animeId);
            return Ok();
        }

        [Authorize]
        [HttpPost("favorites/{animeId}")]
        public async Task<IActionResult> AddAnimeToFavorites([FromRoute] int animeId) {
            var anime = await _animeService.Get(animeId);
            if (anime == null) return NotFound();
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var favoritedAnime = new FavoriteAnime {
                KitsuUserId = appUser.Id,
                AnimeId = anime.Id,
                DateAdded = DateTime.UtcNow
            };

            try
            {
                await this._animeLibraryEntryService.AddToFavorites(favoritedAnime);
                return Created();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavoriteAnimes() {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);
            var favoriteAnimes = await _animeLibraryEntryService.GetFavoriteAnimes(user.Id);
            var dtos = favoriteAnimes.Select(a => new AnimeDto {
                Id = a.Id,
                Title = a.Title,
                ImageBase64 = $"/assets/images/{a.ImageUrl}.jpg"
            }).ToList();

            return Ok(dtos);
        }

        [HttpGet("favorites/{animeId}")]
        public async Task<IActionResult> GetFavoriteAnime([FromRoute] int animeId) {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);
            var anime = await _animeService.Get(animeId);
            var favoriteAnime = await _animeLibraryEntryService.GetFavoriteAnime(user.Id, animeId);
            return Ok(favoriteAnime);
        }

        [HttpDelete("favorites/{animeId}")]
        public async Task<IActionResult> DeleteFavoriteAnime([FromRoute] int animeId) {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);
            await _animeLibraryEntryService.DeleteFavoriteAnime(user.Id, animeId);
            return Ok();
        }

        [HttpPut("favorites/bulk")]
        public async Task<IActionResult> UpdateFavorites([FromBody] List<int> animeIds)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);
            var favoriteAnimes = await _animeLibraryEntryService.GetFavoriteAnimes(user.Id);
            var favoriteAnimeIds = favoriteAnimes.Select(a => a.Id).ToList();
            var toAdd = animeIds.Except(favoriteAnimeIds).ToList(); //get ids in animeIds except that ones you already favorited, so new ones.
            var toRemove = favoriteAnimeIds.Except(animeIds).ToList(); //get animes that didn't match meaning you dont want them
            foreach (var id in toAdd)
            {
                var anime = await _animeService.Get(id);
                var favoriteAnime = new FavoriteAnime
                {
                    KitsuUserId = user.Id,
                    AnimeId = anime.Id,
                    DateAdded = DateTime.UtcNow
                };
                await _animeLibraryEntryService.AddToFavorites(favoriteAnime);
            }
            foreach (var id in toRemove)
            {
                await _animeLibraryEntryService.DeleteFavoriteAnime(user.Id, id);
            }
            return Ok();
        }
    }
}
