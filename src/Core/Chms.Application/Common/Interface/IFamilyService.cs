using Chms.Domain.Entities;

namespace Chms.Application.Common.Interface;

 public interface IFamilyService
    {
        public Task<Guid> Create(Family entity);
        public Task Update(Family entity);
        public Family Get(string id);
        public void Delete(string id);
        public List<Family> List(); 


    }
