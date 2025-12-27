using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chms.Application.Common.Interface.Repositories
{
    public interface IUserCommandRepository
    {
        public Task<long> Create(CreateUserVm entity);
        public Task<long> Update(EditUserVm entity);
        public Task<bool> Delete(long id);
        public Task<bool> UpdatePassword(long id, string password);

    }

    public interface IUserQueryRepository
    {
        public Task<User> GetByUserName(string userName);
        public Task<User> Get(long id);
        public List<User> List();
    }
}
