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
            var directoryPath = @"C:\Users\icase\Code\VS 2022\kitsu-clone\client\src\assets\images";
            var filePath = Path.Combine(directoryPath, fileName + ".jpg");

            // Ensure the directory exists
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            var imageData = memoryStream.ToArray();

            await File.WriteAllBytesAsync(filePath, imageData);
        }
    }
}
