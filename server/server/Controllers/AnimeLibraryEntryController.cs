using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.UserLibrary;
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
    public class AnimeLibraryEntryController : ControllerBase
    {
        private readonly IAnimeService _animeService;
        private readonly IAnimeLibraryEntryService _animeLibraryEntryService;
        private readonly UserManager<KitsuUser> _userManager;
        public AnimeLibraryEntryController(IAnimeService animeService, UserManager<KitsuUser> userManager, IAnimeLibraryEntryService animeLibraryEntryService)
        {
            _animeService = animeService;
            _userManager = userManager;
            _animeLibraryEntryService = animeLibraryEntryService;

        }

        [Authorize]
        [HttpGet("getLibrary")]
        public async Task<IActionResult> GetLibrary()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var recs = await _animeLibraryEntryService.GetLibrary(appUser.Id);
            var dto = new List<LibraryItemDto>();

            foreach (var x in recs)
            {
                var anime = await _animeService.Get(x.AnimeId);
                var image = FileServerService.GetAnimeImage(anime.ImageUrl);
                dto.Add(x.ToLibraryItemDto(anime, image));
            }

            return Ok(dto);
        }

        [Authorize]
        [HttpGet("getStatus/{animeId}")]
        public async Task<IActionResult> GetStatus(int animeId)
        {
            var anime = await _animeService.Get(animeId);
            if (anime == null) return NotFound("User not found.");
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var rec = await _animeLibraryEntryService.GetStatus(appUser.Id, animeId) ?? new AnimeLibraryEntry();
            return Ok(rec.ToAnimeLibraryEntryDto());
        }

        //SetStatus takes in no rating? I don't remember why I decided on this? Need to think
        [Authorize]
        [HttpPost("setStatus")]
        public async Task<IActionResult> SetStatus(SetStatusDto dto)
        {
            var anime = await _animeService.Get(dto.AnimeId);
            if (anime == null) return NotFound();
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var rec = new AnimeLibraryEntry
            {
                AnimeId = dto.AnimeId,
                KitsuUserId = appUser.Id,
                Status = dto.Status,
                EpisodesSeen = dto.EpisodesSeen
            };

            try
            {
                await _animeLibraryEntryService.SetStatus(rec);
                return CreatedAtAction(nameof(GetStatus), new { animeId = rec.AnimeId }, rec.ToAnimeLibraryEntryDto()); //return Id by calling a get route/action?

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
        [HttpPut("editStatus")]
        public async Task<IActionResult> EditStatus(EditStatusDto dto)
        {
            //get library record by id? or by where condition (user and anime ids) and confirm only 1 is returned?
            var match = await _animeLibraryEntryService.GetStatusById(dto.Id);
            if (match == null) return NotFound();
            dto.ToAnimeLibraryEntryFromEdit(match);
            await _animeLibraryEntryService.SaveChanges();
            return Ok(match.ToAnimeLibraryEntryDto());
        }

        [Authorize]
        [HttpDelete("deleteStatus/{animeId}")]
        public async Task<IActionResult> DeleteStatus(int animeId)
        {
            var anime = await _animeService.Get(animeId);
            if (anime == null) return NotFound();
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            await _animeLibraryEntryService.DeleteStatus(appUser.Id, animeId);
            return Ok(new AnimeLibraryEntryDto());
        }

    }
}
