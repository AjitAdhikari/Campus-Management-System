using Chms.Application.Common.Interface;
using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Users;

namespace Chms.Application.Services;

public class UserService : IUserService
{
    private readonly IUserCommandRepository _command;
    private readonly IUserQueryRepository _query;
    public UserService(IUserCommandRepository command, IUserQueryRepository query)
    {
        _command = command;
        _query  = query;
    }
    public async Task<long> Create(CreateUserVm entity)
    {
        return await _command.Create(entity);
    }

    public async Task<bool> Delete(long id)
    {
        return await _command.Delete(id);
    }

    public async Task<UserDetailsVm> Get(long id)
    {
        User user = await  _query.Get(id);
        UserDetailsVm userDetails = new();
        if(user.Id > 0)
        {
                userDetails.Id = user.Id;
                userDetails.FirstName = user.FirstName;
                userDetails.LastName = user.LastName;
                userDetails.UserName = user.UserName;
                userDetails.UserGroup = user.UserGroup;
                userDetails.Email = user.Email;
                userDetails.MiddleName = user.MiddleName;
                userDetails.IsActive = user.IsActive;
            return userDetails;
        }
        return userDetails;
    }

    public Task<long> GetIdByUsername(string username)
    {
        throw new NotImplementedException();
    }

    public Task<GetUsersQueryVm> GetUsers(GetUsersQueryDto query)
    {
        throw new NotImplementedException();
    }

    public List<User> ListAllUsers()
    {
        return _query.List();
    }

    public Task<Dictionary<long, string>> ListUsersIdAndUsername()
    {
        throw new NotImplementedException();
    }

    public Task Update(EditUserVm entity)
    {
        return _command.Update(entity);
    }

    public async Task<bool> UpdatePassword(long id, string password)
    {
        return await _command.UpdatePassword(id, password);
    }
}
