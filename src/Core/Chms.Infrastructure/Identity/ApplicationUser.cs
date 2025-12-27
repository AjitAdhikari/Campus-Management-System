using Chms.Domain.Common.Enums;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Chms.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser<long>
    {
        [MaxLength(50)]
        public string FirstName { get; set; }
        [MaxLength(50)]
        public string MiddleName { get; set; } = null;
        [MaxLength(50)]
        public string LastName { get; set; }
        public UserGroup UserGroup { get; set; }
        public ActiveStatus IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
