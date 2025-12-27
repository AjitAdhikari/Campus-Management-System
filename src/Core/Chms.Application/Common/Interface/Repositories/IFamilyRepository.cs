using Chms.Domain.Entities;

namespace Chms.Application.Common.Interface.Repositories;

public interface IFamilyCommandRepository
{
    
        public Task<int> Create(Family entity);
        public Task Update(Family entity);
        public void Delete(int id);
}

public interface IFamilyQueryRepository
{
        public List<Family> List();
        public Family Get(int id);

}