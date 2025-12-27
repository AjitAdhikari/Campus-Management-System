using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Users;

namespace Chms.Application.Common.Interface;

public interface IIdentityService
{
    Task<long> CreateUserAsync(User user, string password);

    Task<long> CreateUserAsync(User user, string password, string[] permissions);
    Task<User> GetUserByUsername(string username);
    Task<User> GetUserById(long id);
    Task<List<User>> GetAllUsers(GetUsersQueryDto query);
    Task<List<User>> ListAllUsers();
    Task UpdateUserAsync(User entity);
    Task UpdatePasswordAsync(long id, string password);
    Task<bool> DeleteUserAsync(long id);
    Task<double> CountTotalUser();
}