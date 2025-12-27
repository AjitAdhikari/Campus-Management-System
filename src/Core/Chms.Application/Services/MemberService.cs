using Chms.Application.Common.Interface;
using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Members;

namespace Chms.Application.Services;

public class MemberService : IMemberService
{
    public readonly IMemberCommandRepository _command;
    public readonly IMemberQueryRepository _query;
    public MemberService(IMemberCommandRepository commandRepository, IMemberQueryRepository queryRepository)
    {
        _command = commandRepository;
        _query = queryRepository;
    }
    public async Task<Guid> Create(Member entity)
    {
        return await _command.Create(entity);
    }

    public void Delete(Guid id)
    {
        _command.Delete(id);
    }

    public Member Get(Guid id)
    {
        return _query.Get(id);
    }

    public List<MemberListVM> List(FilterVm query)
    {
        return _query.List(query);
    }

    public List<MemberListVM> ListActiveMember()
    {
        return _query.ListActiveMember();
    }

    public int TotalDataCount(FilterVm query)
    {
        return _query.TotalDataCount(query);
    }

    public Task Update(Member entity)
    {
        return _command.Update(entity);
    }
}