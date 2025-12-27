
using Chms.Domain.Entities;
using Chms.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Chms.Infrastructure.Persistence
{
    public partial class ChMSDbContext : IdentityDbContext<ApplicationUser, IdentityRole<long>, long>
    {
        public ChMSDbContext(DbContextOptions<ChMSDbContext> options) : base(options)
        {
        }

        public DbSet<Member> Members { get; set; }
        // public DbSet<Group> Groups {get; set;}
        public DbSet<Family> Families {get; set;}
        public DbSet<MemberFamilyRelation> MemberFamilyRelations {get; set;}
        public DbSet<Inventory> Inventories {get; set;}
        public DbSet<Document> Documents {get; set;}
        public DbSet<Income> Incomes { get; set;}
        public DbSet<Expense> Expenses { get; set;}
 

        public Task<int> SaveChangesAsync()
        {
            return base.SaveChangesAsync();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().ToTable("users");
            builder.Entity<IdentityRole<long>>().ToTable("roles");
            builder.Entity<IdentityUserToken<long>>().ToTable("user_tokens");
            builder.Entity<IdentityUserRole<long>>().ToTable("user_roles");
            builder.Entity<IdentityRoleClaim<long>>().ToTable("role_claims");
            builder.Entity<IdentityUserClaim<long>>().ToTable("user_claims");
            builder.Entity<IdentityUserLogin<long>>().ToTable("user_logins");
        }
    }
}
