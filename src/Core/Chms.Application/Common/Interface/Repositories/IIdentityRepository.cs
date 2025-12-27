using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Users;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chms.Application.Common.Interface.Repositories
{
    public interface IIdentityCommandRepository
    {
        Task<long> CreateUserAsync(User user, string password);
        Task<long> CreateUserAsync(User user, string password, string[] permissions);
        Task UpdateUserAsync(User entity);
        Task UpdatePasswordAsync(long id, string password);
        Task<bool> DeleteUserAsync(long id);

    }

    public interface IIdentityQuereyRepository
    {
        Task<User> GetUserByUsername(string username);
        Task<User> GetUserById(long id);
        Task<List<User>> GetAllUsers(GetUsersQueryDto query);
        Task<List<User>> ListAllUsers();
        Task<double> CountTotalUser();
    }
}
