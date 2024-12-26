using server.Dtos.Franchise;
using server.Models;

namespace server.Mappers
{
    public static class FranchiseMapper
    {
        public static Franchise ToFranchiseFromCreate(this CreateFranchiseDto franchiseDto)
        {
            return new Franchise
            {
                Name = franchiseDto.Name
            };
        }
        public static GetFranchiseDto ToFranchiseDto(this Franchise franchise)
        {
            return new GetFranchiseDto
            {
                Id = franchise.Id,
                Name = franchise.Name
            };
        }
    }
}
