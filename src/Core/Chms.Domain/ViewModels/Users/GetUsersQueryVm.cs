using Chms.Domain.Entities;
using System.Collections.Generic;

namespace Chms.Domain.ViewModels.Users
{
    public class GetUsersQueryVm
    {
        public double TotalPages {get; set;}
        public List<User> Users { get; set; }
    }
}