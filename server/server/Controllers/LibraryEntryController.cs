using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        [Authorize]
        [HttpGet("GetAllByUser")]
        public async Task<IActionResult> GetAllByUser()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var libraryEntries = await _animeLibraryEntryService.GetLibrary(appUser.Id);
            var libraryEntriesWithAnimeInfoDto = new List<LibraryEntryWithAnimeInfoDto>();

            foreach (var l in libraryEntries)
            {
                var anime = await _animeService.Get(l.AnimeId);
                var image = FileServerService.GetAnimeImage(anime.ImageUrl);
                libraryEntriesWithAnimeInfoDto.Add(l.ToLibraryEntryWithAnimeInfoDto(anime, image));
            }

            return Ok(libraryEntriesWithAnimeInfoDto);
        }

        [Authorize]
        [HttpGet("{animeId}")]
        public async Task<IActionResult> Get([FromRoute] int animeId)
        {
            var anime = await _animeService.Get(animeId);
            if (anime == null) return NotFound("User not found.");
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var libraryEntry = await _animeLibraryEntryService.GetStatus(appUser.Id, animeId) ?? new LibraryEntry();
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
            return Ok(new LibraryEntryDto());
        }

    }
}
