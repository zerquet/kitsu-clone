using System.Net;

namespace server.Services
{
    public static class FileServerService
    {
        public static string GetAnimeImage(string id)
        {
            var filePath = @"\\S1DEREA1APTOP\shared\" + id + ".jpg";
            using var client = new WebClient();

            client.Credentials = new NetworkCredential("icaseecho@gmail.com", "161773");

            return Convert.ToBase64String(client.DownloadData(filePath));

        }

        public static void PostAnimeImage(string fileName, IFormFile image)
        {
            using var memoryStream = new MemoryStream();
            image.CopyTo(memoryStream);
            var imageData = memoryStream.ToArray();

            var filePath = @"\\S1DEREA1APTOP\shared\" + fileName + ".jpg";
            using var client = new WebClient();
            client.Credentials = new NetworkCredential("icaseecho@gmail.com", "161773");

            client.UploadDataAsync(new Uri(filePath), imageData);
        }
    }
}
