using Chms.Domain.ViewModels;

namespace Chms.Domain.ViewModels.Documents
{
    public class FilterVm : BaseVm
    {
        public string? Name {get; set;}
        public string? CreatedDate {get; set;}
    }
}