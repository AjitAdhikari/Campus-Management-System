using Chms.Domain.Common.Enums;

namespace ChMS.Web.ViewModels
{
    public class UpdatePassword
    {
        public long Id { get; set; }
        public string? Password { get; set; }
        public string? ConfirmPassword { get; set; }

    }


}
