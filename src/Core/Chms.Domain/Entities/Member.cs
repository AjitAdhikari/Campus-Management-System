using Chms.Domain.Common.Enums;

namespace Chms.Domain.Entities;

    public class Member : BaseModel
    {
        public Guid Id { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName {get; set;}
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? SecondaryPhoneNumber { get; set;}
        public string? BirthDate { get; set; }
        public string? Gender{ get; set;}
        public string? Occupation { get; set; }
        public string? Photo { get; set; }
        public string? PermanentAddress { get; set; }
        public string? TemporaryAddress { get; set; }
        public int GroupId { get; set; } 
        public ChurchRole ChurchRole { get; set; }

        public string? MembershipDate {get; set;}
        public string? BaptizedDate {get; set;}
            
    }

    public class MemberListVM : BaseModel
    {
        public Guid Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? MiddleName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Gender{ get; set;}
        public int GroupId { get; set; } 
        public string? Photo {get; set;}
        public ChurchRole ChurchRole { get; set; }
    }

