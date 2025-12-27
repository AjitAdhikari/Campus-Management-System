using Chms.Application.Common.Exceptions;
using Chms.Application.Common.Interface;
using Chms.Domain.Common.Enums;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Chms.Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private UserManager<ApplicationUser> _userManager;
       
        public IdentityService(
            UserManager<ApplicationUser> userManager
       
        )
        {
            _userManager = userManager;
           
        }
        public async Task<long> CreateUserAsync(User entity, string password)
        {
            try
            {
                var user = new ApplicationUser
                {
                    UserName = entity.UserName,
                    Email = entity.Email,
                    UserGroup = entity.UserGroup,
                    FirstName = entity.FirstName,
                    MiddleName = entity.MiddleName,
                    LastName = entity.LastName,
                    IsActive = entity.IsActive

                };
                if (entity.Id > 0)
                {
                    user.Id = entity.Id;
                }
                var result = await _userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                {
                    throw new Exception("Could not create user");
                }
                return user.Id;
            }
            catch (Exception)
            {
                throw;
            }


        }

        public async Task<long> CreateUserAsync(User entity, string password, string[] permissions)
        {
            try
            {
                var user = new ApplicationUser
                {
                    UserName = entity.UserName,
                    Email = entity.Email,
                    UserGroup = entity.UserGroup,
                    FirstName = entity.FirstName,
                    MiddleName = entity.MiddleName,
                    LastName = entity.LastName,
                    IsActive = entity.IsActive

                };
                if (entity.Id != null)
                {
                    user.Id = entity.Id;
                }
                var result = await _userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    var returnUser = _userManager.FindByNameAsync(user.UserName).GetAwaiter().GetResult();

                    if (permissions.Length > 0)
                    {
                        foreach (var claim in GetClaimsFromArray(permissions))
                        {
                            await _userManager.AddClaimAsync(returnUser, claim);
                        }
                    }
                    if (returnUser == null)
                    {
                        throw new Exception("User Not found");
                    }
                    return returnUser.Id;
                }
                else
                {
                    throw new Exception("Error creating user");
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<User> GetUserByUsername(string username)
        {
            var returnUser = await _userManager.FindByNameAsync(username);


            if (returnUser != null)
            {
                return new User
                {
                    Id = returnUser.Id,
                    Email = returnUser.Email,
                    UserName = returnUser.UserName,
                    UserGroup = returnUser.UserGroup,
                    FirstName = returnUser.FirstName,
                    MiddleName = returnUser.MiddleName,
                    LastName = returnUser.LastName,
                    IsActive = returnUser.IsActive,
                };
            }
            throw new NotFoundException();
        }

        public async Task<List<User>> GetAllUsers(GetUsersQueryDto query)
        {
            var users = _userManager.Users.AsNoTracking();
            if(!String.IsNullOrEmpty(query.RequestFilter.Username))
            {
                users = users.Where(x => x.UserName.Contains(query.RequestFilter.Username));
            }

            if(query.RequestFilter.Usergroup > 0)
            {
                users = users.Where( x => x.UserGroup == (UserGroup)query.RequestFilter.Usergroup);
            }
            if(query.RequestFilter.ActiveStatus > 0)
            {
                users = users.Where( x => x.IsActive == (ActiveStatus)query.RequestFilter.ActiveStatus);
            }

            return await users.Select(u => new User
            {
                Id = u.Id,
                Email = u.Email,
                UserName = u.UserName,
                UserGroup = u.UserGroup,
                FirstName = u.FirstName,
                MiddleName = u.MiddleName,
                LastName = u.LastName,
                IsActive = u.IsActive,
            }).OrderBy(x => x.UserName)
            .Skip(query.Offset).Take(query.Limit).ToListAsync();

        }
        public async Task<User> GetUserById(long id)
        {
            var entity = new User();
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

            }
            return await Task.FromResult<User>(entity);
        }
        private List<Claim> GetClaimsFromArray(string[] permissions)
        {
            List<Claim> claims = new List<Claim>();
            if (permissions.Length > 0)
            {
                foreach (var item in permissions)
                {
                    var claim = new Claim(item, item);
                    claims.Add(claim);
                }
            }
            return claims;
        }

        public async Task UpdatePasswordAsync(long id, string password)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new NotFoundException();
            }
            var pass = password.ToString();
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, pass);
            if (!result.Succeeded)
            {
                throw new Exception(result.Errors.ToString());
            }
        }

        public async Task UpdateUserAsync(User entity)
        {
            var user = await _userManager.FindByIdAsync(entity.Id.ToString());
            if (user == null)
            {
                throw new NotFoundException();
            }
            user.Email = entity.Email;
            user.UserName = entity.UserName;
            user.UserGroup = entity.UserGroup;
            user.Email = entity.Email;
            user.UserGroup = entity.UserGroup;
            user.FirstName = entity.FirstName;
            user.MiddleName = entity.MiddleName;
            user.LastName = entity.LastName;
            user.IsActive = entity.IsActive;

            IdentityResult result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception(result.Errors.ToString());
            }

        }
        public async Task<bool> DeleteUserAsync(long id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<List<User>> ListAllUsers()
        {
           return await _userManager.Users.Select(u => new User
            {
                Id = u.Id,
                Email = u.Email,
                UserName = u.UserName,
                UserGroup = u.UserGroup,
                FirstName = u.FirstName,
                MiddleName = u.MiddleName,
                LastName = u.LastName,
                IsActive = u.IsActive,
            }).ToListAsync();
        }

        public async Task<double> CountTotalUser()
        {
            double total = (await _userManager.Users.CountAsync()/10f);
            return Math.Ceiling(total);
        }

    }
}
