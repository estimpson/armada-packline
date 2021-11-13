using Microsoft.EntityFrameworkCore;

namespace api.FxDatabase
{
    public class FxContext : DbContext
    {
        public FxContext(DbContextOptions<FxContext> options) : base(options)
        { }

        public DbSet<ResultLogin> ResultLogins { get; set; }
        public DbSet<XmlResult> XmlResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // _ = modelBuilder.Entity<PacklinePart>().ToTable("PacklineParts").HasNoKey();
        }
    }
}