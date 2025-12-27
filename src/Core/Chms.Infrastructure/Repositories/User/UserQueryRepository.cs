using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Users;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Identity;
using Chms.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chms.Infrastructure.Repositories.User
{
    public class UserQueryRepository : IUserQueryRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ChMSDbContext _context;
        private readonly BaseRepository _baseRepository;
        public const string TABLE_NAME = "users";

        public UserQueryRepository(ChMSDbContext context, UserManager<ApplicationUser> userManager, BaseRepository baseRepository)
        {
            _context = context;
            _userManager = userManager;
            _baseRepository = baseRepository;
        }

        public async Task<Domain.Entities.User> Get(long id)
        {
            var entity = new Domain.Entities.User();
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user != null)
            {
                entity.UserName = user.UserName;
                entity.Id = user.Id;
                entity.Email = user.Email;
                entity.UserGroup = user.UserGroup;
                entity.FirstName = user.FirstName;
                entity.MiddleName = user.MiddleName;
                entity.LastName = user.LastName;
                entity.IsActive = user.IsActive;
                entity.CreatedAt = user.CreatedAt;
                entity.UpdatedAt = user.UpdatedAt;
                entity.SecurityStamp = user.SecurityStamp;
            }
            return await Task.FromResult(entity);
        }

        public async Task<Domain.Entities.User> GetByUserName(string userName)
        {
            var returnUser = await _userManager.FindByNameAsync(userName);

            if (returnUser != null)
            {
                return new Domain.Entities.User
                {
                    Id = returnUser.Id,
                    Email = returnUser.Email,
                    UserName = returnUser.UserName,
                    FirstName = returnUser.FirstName,
                    MiddleName = returnUser.MiddleName,
                    LastName = returnUser.LastName
                };
            }
            throw new Exception();
        }

        public List<Domain.Entities.User> List()
        {
             var sql = @$"select Username, Email,IsActive,UserGroup,Id from `{TABLE_NAME}`";
            var where = new { };
            var result = _baseRepository.LoadData<Domain.Entities.User, object>(sql, where).GetAwaiter().GetResult();
            return result;
        }
    }
}
