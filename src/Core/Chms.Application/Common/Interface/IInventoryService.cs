using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Inventories;
namespace Chms.Application.Common.Interface;

 public interface IInventoryService
    {
        public Task<int> Create(Inventory entity);
        public Task Update(Inventory entity);
        public Inventory Get(int id);
        public void Delete(int id);
        public List<Inventory> List(FilterVm query); 
        public int TotalDataCount(FilterVm query);

    }
