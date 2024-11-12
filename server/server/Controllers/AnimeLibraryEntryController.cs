using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        private readonly AnimeService _animeService;
        private readonly AnimeLibraryEntryService _animeLibraryEntryService;
        private readonly UserManager<KitsuUser> _userManager;
        public AnimeLibraryEntryController(AnimeService animeService, UserManager<KitsuUser> userManager, AnimeLibraryEntryService animeLibraryEntryService)
        {
            _animeService = animeService;
            _userManager = userManager;
            _animeLibraryEntryService = animeLibraryEntryService;

        }
        [Authorize]
        [HttpPost("setStatus")]
        public async Task<IActionResult> SetStatus(
            int animeId, 
            [RegularExpression("completed|planning|watching")] string status, 
            int episodesSeen)
        {
            var anime = await _animeService.Get(animeId);
            if (anime == null) return NotFound();
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var rec = new AnimeLibraryEntry
            {
                AnimeId = animeId,
                KitsuUserId = appUser.Id,
                Status = status,
                EpisodesSeen = episodesSeen
            };

            try
            {
                await _animeLibraryEntryService.SetStatus(rec);
                return Created(); //return Id by calling a get route/action?

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

        [HttpPut("editStatus")]
        public async Task<IActionResult> EditStatus(int animeId, string status, int episodesSeen, string? rating)
        {
            throw new NotImplementedException();
        }

    }
}
