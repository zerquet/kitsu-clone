using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Dtos.Account;
using server.Models.Identity;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<KitsuUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<KitsuUser> _signInManager;
        public AccountController(UserManager<KitsuUser> userManager, ITokenService tokenService, SignInManager<KitsuUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            //NOTE: In IdentityCore middleware, we specified to have unique emails. 
            //      Unsure why it also checks for Username. Where is the setting for that?
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                //Use mapper?
                var appUser = new KitsuUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.EmailAddress
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, registerDto.Role);
                    if (roleResult.Succeeded)
                    {
                        return Ok(
                            new NewUserDto
                            {
                                Username = appUser.UserName,
                                Email = appUser.Email,
                                Token = _tokenService.CreateToken(appUser)
                            }
                        );
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                if(!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.FindByEmailAsync(loginDto.Email); //this is another way
                if (user == null) return Unauthorized("Invalid email");

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
                if (!result.Succeeded) return Unauthorized("Invalid password!"); //dont be too specific bc its a vuln

                return Ok(new NewUserDto
                {
                    Email = user.Email,
                    Username = user.UserName,
                    Token = _tokenService.CreateToken(user)
                });
            }
            catch (Exception e)
            {

                return StatusCode(500, e);
            }
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var appUser = await _userManager.FindByEmailAsync(email);
            var token = ((string)Request.Headers.Authorization)[7..]; //Skips 'Bearer ' part of value
            return Ok(new NewUserDto { Email = email, Username = appUser.UserName, Token = token });
        }
    }
}
