using System;

namespace server.Dtos.Account;

public class UserProfileDto
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string? Bio { get; set; }
    public string? Location { get; set; }
    public DateOnly? Birthday { get; set; }
    public string? Gender { get; set; }
}
