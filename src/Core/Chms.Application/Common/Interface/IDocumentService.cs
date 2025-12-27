using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Documents;

namespace Chms.Application.Common.Interface
{
    public interface IDocumentService
    {
        public Task<Guid> Create(Document entity);
        public Task Update(Document entity);
        public void Delete(string id);
        public List<Document> List(FilterVm filterVm);
        public Document Get(string id);
        public int TotalDataCount(FilterVm filterVm);
    }
}