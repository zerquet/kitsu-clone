using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.Identity;

namespace server.Data
{
    public class AppDbContext: IdentityDbContext<KitsuUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "User",
                    NormalizedName = "USER"
                }
            };

            modelBuilder.Entity<IdentityRole>().HasData(roles);

            //Define relationships...
            modelBuilder.Entity<KitsuUser>()
                .HasMany(ku => ku.Animes)
                .WithMany(a => a.KitsuUsers)
                .UsingEntity<AnimeLibraryEntry>();
        }

        public DbSet<Anime> Animes => Set<Anime>(); 
        public DbSet<AnimeLibraryEntry> AnimeLibraryEntries => Set<AnimeLibraryEntry>();
    }
}
