using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Inventories;
namespace Chms.Application.Common.Interface.Repositories;

public interface IInventoryCommandRepository
{
    public Task<int> Create(Inventory entity);
    public Task<int> Update(Inventory entity);
    public void Delete(int id);
}

public interface IInventoryQueryRepository
{
    public Inventory Get(int id);
    public List<Inventory> List(FilterVm filterQuery);
    public int TotalDataCount(FilterVm filterQuery);
}