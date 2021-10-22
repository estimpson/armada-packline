using Microsoft.EntityFrameworkCore;

namespace api.FxDatabase
{
    public class FxContext : DbContext
    {
        public FxContext(DbContextOptions<FxContext> options) : base(options)
        { }

        public DbSet<PacklinePart> PacklineParts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // _ = modelBuilder.Entity<PacklinePart>().ToTable("PacklineParts").HasNoKey();
        }
    }
}