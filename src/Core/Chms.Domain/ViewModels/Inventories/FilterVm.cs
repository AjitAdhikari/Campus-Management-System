using Chms.Domain.ViewModels;

namespace Chms.Domain.ViewModels.Inventories
{
    public class FilterVm : BaseVm
    {
        public string? Name {get; set;}
        public string? Code {get; set;}
    }
}