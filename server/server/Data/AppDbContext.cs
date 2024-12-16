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

            modelBuilder.Entity<Anime>()
                .HasMany(a => a.Categories)
                .WithMany(c => c.Animes)
                .UsingEntity<AnimeCategory>()
                .ToTable("AnimeCategory"); //Telling EF Core that "AnimeCategories" here is "AnimeCategory" in the db.
        }

        public DbSet<Anime> Animes => Set<Anime>(); 
        public DbSet<AnimeLibraryEntry> AnimeLibraryEntries => Set<AnimeLibraryEntry>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<AnimeCategory> AnimeCategories => Set<AnimeCategory>();
    }
}
