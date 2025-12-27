using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Common.Enums;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Users;
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
    public class UserCommandRepository : IUserCommandRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ChMSDbContext _context;

        public UserCommandRepository(ChMSDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<long> Create(CreateUserVm entity)
        {
            var user = new ApplicationUser
            {
                UserName = entity.UserName,
                Email = entity.Email,
                UserGroup = UserGroup.Admin,
                FirstName = entity.FirstName,
                MiddleName = entity.MiddleName,
                LastName = entity.LastName,
                PasswordHash = entity.Password,
                IsActive = ActiveStatus.Active,
                CreatedAt = DateTime.Now,
            };
            var result = await _userManager.CreateAsync(user, entity.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(x => new { Code = x.Code, Description = x.Description }).ToList();
                Dictionary<string, string> dict = new();
                foreach (var item in errors)
                {
                    dict.Add(item.Code.ToString(), item.Description.ToString());
                }

            }
            return user.Id;
        }

        public async Task<bool> Delete(long id)
        {
            ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());
            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<long> Update(EditUserVm entity)
        {
            var user = await _userManager.FindByIdAsync(entity.Id.ToString());
            user.UserName = entity.UserName;
            user.UserGroup = entity.UserGroup;
            user.Email = entity.Email;
            user.UserGroup = entity.UserGroup;
            user.FirstName = entity.FirstName;
            user.MiddleName = entity.MiddleName;
            user.LastName = entity.LastName;
            user.IsActive = entity.IsActive;
            user.UpdatedAt = DateTime.UtcNow;
            IdentityResult result = await _userManager.UpdateAsync(user);
            if(result.Succeeded)
            {
                return user.Id;
            }
            return 0;
        }

        public async Task<bool> UpdatePassword(long id, string password)
        {
             var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return false;
            }
            var pass = password.ToString();
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, pass);
            if (!result.Succeeded)
            {
                return false;
            }
            return true;
        }
    }
}
