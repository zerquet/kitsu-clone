using System.Net;

namespace server.Services
{
    public static class FileServerService
    {
        public static string? GetAnimeImage(string? id)
        {
            if (id == null) return null;
            var filePath = @"\\s1derea1n1ne\shared\" + id + ".jpg";
            using var client = new WebClient();

            client.Credentials = new NetworkCredential("icase", "lingering");

            return Convert.ToBase64String(client.DownloadData(filePath));

        }

        public static async Task PostAnimeImage(string fileName, IFormFile image)
        {
            using var memoryStream = new MemoryStream();
            image.CopyTo(memoryStream);
            var imageData = memoryStream.ToArray();

            var filePath = @"https://localhost:4200/assets/images/" + fileName + ".jpg";
            using var client = new HttpClient();

            var content = new ByteArrayContent(imageData);

            await client.PostAsync(filePath, content);
        }
    }
}
