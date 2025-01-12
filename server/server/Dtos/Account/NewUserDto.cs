namespace server.Dtos.Account
{
    public class NewUserDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public bool IsAdmin { get; set;} = false;
    }
}
