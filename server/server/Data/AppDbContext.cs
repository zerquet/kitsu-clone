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
                .UsingEntity<LibraryEntry>();

            modelBuilder.Entity<Anime>()
                .HasMany(a => a.Categories)
                .WithMany(c => c.Animes)
                .UsingEntity<AnimeCategory>()
                .ToTable("AnimeCategory"); //Telling EF Core that "AnimeCategories" here is "AnimeCategory" in the db.

            modelBuilder.Entity<Anime>()
                .HasOne(a => a.Franchise)
                .WithMany(f => f.Animes);

            modelBuilder.Entity<Anime>()
                .HasMany(a => a.EpisodeList)
                .WithOne(e => e.Anime);

            modelBuilder.Entity<Episode>().ToTable("Episode");
            modelBuilder.Entity<Franchise>().ToTable("Franchise");

            modelBuilder.Entity<KitsuUser>()
                .HasMany(ku => ku.FavoriteAnimes)
                .WithMany(a => a.FavoriteUsers)
                .UsingEntity<FavoriteAnime>()
                .ToTable("FavoriteAnime");
        }

        public DbSet<Anime> Animes => Set<Anime>(); 
        public DbSet<LibraryEntry> LibraryEntries => Set<LibraryEntry>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<AnimeCategory> AnimeCategories => Set<AnimeCategory>();
        public DbSet<Franchise> Franchises => Set<Franchise>();
        public DbSet<Episode> Episodes => Set<Episode>();
        public DbSet<FavoriteAnime> FavoriteAnimes => Set<FavoriteAnime>();
    }
}
