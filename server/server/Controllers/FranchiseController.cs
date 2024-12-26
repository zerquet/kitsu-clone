using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Franchise;
using server.Mappers;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FranchiseController : ControllerBase
    {
        private readonly IFranchiseService _franchiseService;
        public FranchiseController(IFranchiseService franchiseService)
        {
            _franchiseService = franchiseService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateFranchiseDto request) 
        {
            //This is literally just a name, why not just use a string?
            //TODO: Check if franchise already exists
            var franchise = request.ToFranchiseFromCreate();
            await _franchiseService.AddFranchise(franchise);
            return Ok();
        }

        [HttpGet("GetByKeyword")]
        public async Task<IActionResult> Get([FromQuery] string keyword)
        {
            if (string.IsNullOrEmpty(keyword)) return Ok(new List<GetFranchiseDto>());
            var franchises = await _franchiseService.GetFranchises(keyword);
            var franchisesDto = franchises.Select(f => f.ToFranchiseDto());
            return Ok(franchisesDto);
        }
    }
}
