using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Account
{
    public class RegisterDto
    {
        [Required]
        public string? Username { get; set; }
        [Required]
        [EmailAddress]
        public string? EmailAddress { get; set; }
        [Required]
        public string? Password { get; set; }
        [RegularExpression("User|Admin")]
        public string? Role { get; set; } = "User";
    }
}
