using Chms.Domain.Common.Enums;
using Chms.Domain.Entities;

namespace ChMS.Web.ViewModels
{
    public class CreateMemberVm
    {
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? SecondaryPhoneNumber { get; set; }
        public string? BirthDate { get; set; }
        public string? Gender { get; set; }
        public string? Occupation { get; set; }
        public IFormFile? PhotoFile { get; set; }
        public string? PermanentAddress { get; set; }
        public string? TemporaryAddress { get; set; }
        public int GroupId { get; set; } = 1;
        public string? MembershipDate { get; set; }
        public string? BaptizedDate { get; set; }
    }
    public class EditMemberVm : CreateMemberVm
    {
        public Guid Id { get; set; }
        public string? Photo { get; set; }

    }

    public class MemberListResponseVm 
    {
        public List<MemberListVM> Items {get; set;} = new();
        public int TotalDataCount {get; set;} = 0;
    }

    public class MembFilterQueryVm 
    {
        public string? Name {get; set;}
        public string? PhoneNumber {get; set;}
        public string? Gender {get; set;}
        public int Limit { get; set; } = 20;
        public int Offset { get; set; } = 0;
    }
}


