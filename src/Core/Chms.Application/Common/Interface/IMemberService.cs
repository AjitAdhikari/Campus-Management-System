using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Members;

namespace Chms.Application.Common.Interface;

 public interface IMemberService
    {
        public Task<Guid> Create(Member entity);
        public Task Update(Member entity);
        public Member Get(Guid id);
        public void Delete(Guid id);
        public List<MemberListVM> List(FilterVm query); 
        public int TotalDataCount(FilterVm query);
        public List<MemberListVM> ListActiveMember();


}
