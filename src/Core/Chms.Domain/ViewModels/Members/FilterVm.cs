using Chms.Domain.ViewModels;

namespace Chms.Domain.ViewModels.Members
{
    public class FilterVm : BaseVm
    {
        public string? Name {get; set;}
        public string? PhoneNumber {get; set;}
        public string? Gender {get; set;}
    }
}