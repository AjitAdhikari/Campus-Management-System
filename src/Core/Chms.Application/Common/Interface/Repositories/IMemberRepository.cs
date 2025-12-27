using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Members;

namespace Chms.Application.Common.Interface.Repositories;
   
public interface IMemberCommandRepository
{
    public Task<Guid> Create(Member entity);
    public Task<Guid> Update(Member entity);
    public void Delete(Guid id);

}

public interface IMemberQueryRepository
{
    public Member Get(Guid id);
    public List<MemberListVM> List(FilterVm filterQuery);
    public int TotalDataCount(FilterVm filterQuery);
    public List<MemberListVM> ListActiveMember();
}